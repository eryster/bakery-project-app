import { collection, doc, runTransaction, serverTimestamp, getDocs, onSnapshot } from "firebase/firestore";
import { Category, Item } from "~/types";
import { generateUniqueId } from "./generateUniqueId";
import { db } from "~/services";

export class CategoryManager {
  private categoriesCollectionRef = collection(db, 'categories');

  onCategoriesAndProductsChange(callback: (categories: Category[]) => void) {
    const categoriesMap: { [key: string]: Category } = {};
    const itemListeners: { [key: string]: () => void } = {};

    const syncState = () => {
      const sortedCategories = Object.values(categoriesMap).sort((a, b) => a.name.localeCompare(b.name));
      callback(sortedCategories);
    };

    const categoriesUnsubscribe = onSnapshot(this.categoriesCollectionRef, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        const categoryId = change.doc.id;
        const data = change.doc.data();

        if (change.type === 'removed') {
          if (itemListeners[categoryId]) {
            itemListeners[categoryId]();
            delete itemListeners[categoryId];
          }
          delete categoriesMap[categoryId];
          syncState();

        } else if (change.type === 'added') {
          categoriesMap[categoryId] = {
            id: Number(data.id),
            name: data.name,
            items: [],
          };

          const itemsCollectionRef = collection(this.categoriesCollectionRef, categoryId, 'items');
          const itemUnsubscribe = onSnapshot(itemsCollectionRef, (itemSnapshot) => {
            const category = categoriesMap[categoryId];
            if (!category) return;

            itemSnapshot.docChanges().forEach(itemChange => {
              const itemId = Number(itemChange.doc.id);
              if (itemChange.type === 'removed') {
                category.items = category.items.filter(item => item.id !== itemId);
              } else {
                const itemData = itemChange.doc.data() as Omit<Item, 'id'>;
                const item: Item = { ...itemData, id: itemId };
                const itemIndex = category.items.findIndex(i => i.id === itemId);

                if (itemIndex > -1) {
                  category.items[itemIndex] = item;
                } else {
                  category.items.push(item);
                }
              }
            });
            
            category.items.sort((a, b) => a.name.localeCompare(b.name));
            syncState();
          });

          itemListeners[categoryId] = itemUnsubscribe;

        } else if (change.type === 'modified') {
          const category = categoriesMap[categoryId];
          if (category) {
            category.name = data.name;
            syncState();
          }
        }
      });
    });

    return () => {
      categoriesUnsubscribe();
      Object.values(itemListeners).forEach(unsubscribe => unsubscribe());
    };
  }

  async addOrUpdateCategory(category: Category) {
    try {
      const categoryId = category.id?.toString() || generateUniqueId();
      const categoryRef = doc(db, "categories", categoryId);
      
      const newCategoryData = {
        name: category.name,
        id: Number(categoryId),
        timestamp: serverTimestamp(),
      };

      await runTransaction(db, async (transaction) => {
        transaction.set(categoryRef, newCategoryData, { merge: true });
        
        for (const item of category.items) {
          const itemId = item.id?.toString() || generateUniqueId();
          const itemRef = doc(categoryRef, "items", itemId);
          
          const newItemData = {
            ...item,
            id: Number(itemId),
            timestamp: serverTimestamp(),
          };
          
          transaction.set(itemRef, newItemData, { merge: true });
        }
      });

      console.log(`Category "${category.name}" saved successfully.`);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  }

  async addOrUpdateProduct(item: Item) {
    try {
      const itemId = item.id?.toString() || generateUniqueId();
      const categoryRef = doc(db, "categories", item.categoryId.toString());
      const itemRef = doc(categoryRef, "items", itemId);

      const newItemData = {
        ...item,
        id: Number(itemId),
        timestamp: serverTimestamp(),
      };

      await runTransaction(db, async (transaction) => {
        transaction.set(itemRef, newItemData, { merge: true });
      });

      console.log(`Product "${item.name}" saved in category ${item.categoryId}.`);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }

  async removeCategory(categoryId: string) {
    try {
      const categoryRef = doc(db, "categories", categoryId);
      const itemsSnapshot = await getDocs(collection(categoryRef, "items"));

      await runTransaction(db, async (transaction) => {
        itemsSnapshot.forEach((itemDoc) => transaction.delete(itemDoc.ref));
        transaction.delete(categoryRef);
      });

      console.log(`Category ${categoryId} removed successfully.`);
    } catch (error) {
      console.error("Error removing category:", error);
    }
  }

  async removeProduct(categoryId: string, productId: string) {
    try {
      const productRef = doc(db, "categories", categoryId, "items", productId);

      await runTransaction(db, async (transaction) => {
        transaction.delete(productRef);
      });

      console.log(`Product ${productId} removed from category ${categoryId}.`);
    } catch (error) {
      console.error("Error removing product:", error);
    }
  }
}