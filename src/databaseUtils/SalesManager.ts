import { arrayRemove, arrayUnion, collection, doc, getDocs, increment, onSnapshot, orderBy, query, runTransaction } from "firebase/firestore";
import { db } from "~/services";
import { Day, History, SaleData, Sales, Year } from "~/types";

export class SalesManager {
  async addSale(saleData: SaleData): Promise<boolean> {
    try {
      await runTransaction(db, async (transaction) => {
        const itemsSelledCount = saleData.items.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = saleData.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const profit = saleData.items.reduce((sum, item) => sum + item.profit, 0);

        const now = new Date();
        const yearStr = now.getFullYear().toString();
        const monthStr = (now.getMonth() + 1).toString().padStart(2, '0');
        const dayStr = now.getDate().toString().padStart(2, '0');

        const productRefs = saleData.items.map(item =>
          doc(db, 'categories', item.categoryId.toString(), 'items', item.id.toString())
        );
        const dayCounterRef = doc(db, 'year', yearStr, 'month', monthStr, 'day', dayStr, 'counters', 'sales');

        const docs = await Promise.all([
          transaction.get(dayCounterRef),
          ...productRefs.map(ref => transaction.get(ref))
        ]);

        const counterDoc = docs[0];
        const productDocs = docs.slice(1);

        const newCount = (counterDoc.data()?.count || 0) + 1;

        for (let i = 0; i < saleData.items.length; i++) {
          const item = saleData.items[i];
          const productDoc = productDocs[i];
          if (!productDoc.exists()) {
            throw new Error(`Product "${item.name}" not found.`);
          }
          const currentStock = productDoc.data().stock || 0;
          if (currentStock < item.qty) {
            throw new Error(`Insufficient stock for "${item.name}".`);
          }
        }

        saleData.items.forEach((item, i) => {
          transaction.update(productRefs[i], { stock: increment(-item.qty) });
        });

        const newSaleId = doc(collection(db, 'sales')).id;
        const saleObjectForDay = {
          ...saleData,
          id: newSaleId,
          count: newCount,
          itemsSelledCount,
          totalPrice,
          profit,
          timestamp: now,
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          day: now.getDate(),
        };

        transaction.set(dayCounterRef, { count: newCount });

        const summaryIncrement = {
          itemsSelledCount: increment(itemsSelledCount),
          totalPrice: increment(totalPrice),
          profit: increment(profit),
        };

        const yearRef = doc(db, 'year', yearStr);
        const monthRef = doc(db, 'year', yearStr, 'month', monthStr);
        const dayRef = doc(db, 'year', yearStr, 'month', monthStr, 'day', dayStr);

        transaction.set(dayRef, {
          ...summaryIncrement,
          day: now.getDate(),
          sales: arrayUnion(saleObjectForDay),
        }, { merge: true });

        transaction.set(monthRef, summaryIncrement, { merge: true });
        transaction.set(yearRef, summaryIncrement, { merge: true });
      });
      return true;
    } catch (error) {
      console.error("Sale transaction failed:", error);
      return false;
    }
  }

  private async findSaleDayDocument(saleId: string): Promise<{ dayDocRef: any; saleData: Sales | null }> {
    const now = new Date();
    const yearStr = now.getFullYear().toString();
    const monthStr = (now.getMonth() + 1).toString().padStart(2, '0');
    const daysCollectionRef = collection(db, 'year', yearStr, 'month', monthStr, 'day');

    const querySnapshot = await getDocs(daysCollectionRef);
    for (const doc of querySnapshot.docs) {
      const dayData = doc.data() as Day;
      if (dayData.sales) {
        const foundSale = dayData.sales.find(s => s.id === saleId);
        if (foundSale) {
          return { dayDocRef: doc.ref, saleData: foundSale };
        }
      }
    }
    return { dayDocRef: null, saleData: null };
  }

  async deleteSale(saleId: string): Promise<boolean> {
    try {
      const { dayDocRef } = await this.findSaleDayDocument(saleId);
      if (!dayDocRef) {
        throw new Error("Sale not found for deletion.");
      }

      await runTransaction(db, async (transaction) => {
        const dayDoc = await transaction.get(dayDocRef);
        if (!dayDoc.exists()) {
          throw new Error("Sale day document not found in transaction.");
        }

        const currentDayData = dayDoc.data() as Day;
        const saleToDelete = currentDayData.sales.find(s => s.id === saleId);
        if (!saleToDelete) {
          throw new Error("Sale not found in day document.");
        }

        const { year, month } = saleToDelete;
        const yearStr = year.toString();
        const monthStr = month.toString().padStart(2, '0');

        const monthRef = doc(db, 'year', yearStr, 'month', monthStr);
        const yearRef = doc(db, 'year', yearStr);
        const dayCounterRef = doc(dayDocRef, 'counters', 'sales');

        for (const item of saleToDelete.items) {
          const productRef = doc(db, 'categories', item.categoryId.toString(), 'items', item.id.toString());
          transaction.update(productRef, { stock: increment(item.qty) });
        }

        const decrementData = {
          itemsSelledCount: increment(-saleToDelete.itemsSelledCount),
          totalPrice: increment(-saleToDelete.totalPrice),
          profit: increment(-saleToDelete.profit),
        };

        transaction.update(monthRef, decrementData);
        transaction.update(yearRef, decrementData);

        if (currentDayData.sales.length === 1) {
          transaction.delete(dayDocRef);
          transaction.delete(dayCounterRef);
        } else {
          transaction.update(dayDocRef, {
            ...decrementData,
            sales: arrayRemove(saleToDelete),
          });
        }
      });
      return true;
    } catch (error) {
      console.error("Error deleting sale:", error);
      return false;
    }
  }

  async deleteItemFromSale(saleId: string, itemId: number, categoryId: number): Promise<boolean> {
    try {
      const { dayDocRef } = await this.findSaleDayDocument(saleId);
      if (!dayDocRef) {
        throw new Error("Sale not found to delete item from.");
      }

      await runTransaction(db, async (transaction) => {
        const dayDoc = await transaction.get(dayDocRef);
        if (!dayDoc.exists()) {
          throw new Error("Sale day document not found.");
        }

        const currentDayData = dayDoc.data() as Day;
        const saleToUpdate = currentDayData.sales.find((s) => s.id === saleId);
        if (!saleToUpdate) {
          throw new Error("Sale not found in day document.");
        }

        const itemToDelete = saleToUpdate.items.find(
          (item) => item.id === itemId && item.categoryId === categoryId
        );
        if (!itemToDelete) {
          throw new Error("Item not found in sale.");
        }

        const { year, month } = saleToUpdate;
        const yearStr = year.toString();
        const monthStr = month.toString().padStart(2, '0');

        const monthRef = doc(db, 'year', yearStr, 'month', monthStr);
        const yearRef = doc(db, 'year', yearStr);
        const dayCounterRef = doc(dayDocRef, 'counters', 'sales');

        const productRef = doc(db, 'categories', itemToDelete.categoryId.toString(), 'items', itemToDelete.id.toString());
        transaction.update(productRef, { stock: increment(itemToDelete.qty) });

        const decrementData = {
          itemsSelledCount: increment(-itemToDelete.qty),
          totalPrice: increment(-itemToDelete.totalPrice),
          profit: increment(-itemToDelete.profit),
        };

        transaction.update(monthRef, decrementData);
        transaction.update(yearRef, decrementData);

        const isLastItemOfSale = saleToUpdate.items.length === 1;
        const isLastSaleOfDay = currentDayData.sales.length === 1;

        if (isLastItemOfSale && isLastSaleOfDay) {
          transaction.delete(dayDocRef);
          transaction.delete(dayCounterRef);
        } else if (isLastItemOfSale) {
          transaction.update(dayDocRef, {
            ...decrementData,
            sales: arrayRemove(saleToUpdate),
          });
        } else {
          const updatedSale = {
            ...saleToUpdate,
            items: saleToUpdate.items.filter(item => !(item.id === itemId && item.categoryId === categoryId)),
            itemsSelledCount: saleToUpdate.itemsSelledCount - itemToDelete.qty,
            totalPrice: saleToUpdate.totalPrice - itemToDelete.totalPrice,
            profit: saleToUpdate.profit - itemToDelete.profit,
          };
          const newSalesArray = currentDayData.sales.map((s) => s.id === saleId ? updatedSale : s);
          transaction.update(dayDocRef, {
            ...decrementData,
            sales: newSalesArray,
          });
        }
      });
      return true;
    } catch (error) {
      console.error("Error deleting item from sale:", error);
      return false;
    }
  }

  subscribeToHistory(callback: (history: History) => void) {
    const now = new Date();
    const currentYearStr = now.getFullYear().toString();
    const currentMonthStr = (now.getMonth() + 1).toString().padStart(2, '0');

    const daysQuery = query(
      collection(db, 'year', currentYearStr, 'month', currentMonthStr, 'day'),
      orderBy('day', 'asc')
    );
    const yearRef = doc(db, 'year', currentYearStr);
    let cachedYearData: Partial<Year> = {};

    const unsubYear = onSnapshot(yearRef, (doc) => {
      cachedYearData = doc.data() || {};
    });

    const unsubDays = onSnapshot(daysQuery, (snapshot) => {
      if (snapshot.empty) {
        callback({ years: [] });
        return;
      }

      const daysData: Day[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Day;
        if (data.sales) {
          data.sales.sort((a, b) => a.count - b.count);
        }
        return data;
      });

      const monthTotalPrice = daysData.reduce((sum, day) => sum + day.totalPrice, 0);
      const monthProfit = daysData.reduce((sum, day) => sum + day.profit, 0);
      const monthItemsSelled = daysData.reduce((sum, day) => sum + day.itemsSelledCount, 0);

      const history: History = {
        years: [{
          year: parseInt(currentYearStr),
          totalPrice: cachedYearData.totalPrice ?? monthTotalPrice,
          profit: cachedYearData.profit ?? monthProfit,
          itemsSelledCount: cachedYearData.itemsSelledCount ?? monthItemsSelled,
          months: [{
            month: parseInt(currentMonthStr),
            totalPrice: monthTotalPrice,
            profit: monthProfit,
            itemsSelledCount: monthItemsSelled,
            days: daysData,
          }],
        }],
      };
      callback(history);
    });

    return () => {
      unsubYear();
      unsubDays();
    };
  }

  onTodaySummaryChange(callback: (todaySummary: Day | null) => void) {
    const now = new Date();
    const currentYearStr = now.getFullYear().toString();
    const currentMonthStr = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentDayStr = now.getDate().toString().padStart(2, '0');
    const dayRef = doc(db, 'year', currentYearStr, 'month', currentMonthStr, 'day', currentDayStr);

    const unsubscribe = onSnapshot(dayRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Day;
          if (data.sales) {
            data.sales.sort((a, b) => a.count - b.count);
          }
          callback(data);
        } else {
          callback({
            day: parseInt(currentDayStr),
            totalPrice: 0,
            profit: 0,
            itemsSelledCount: 0,
            sales: [],
          });
        }
      },
      (error) => {
        console.error("Error subscribing to daily summary:", error);
        callback(null);
      }
    );
    return unsubscribe;
  }
}