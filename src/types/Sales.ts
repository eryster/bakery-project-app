import { ItemSale } from "./ItemSale";

export type Sales = {
  id: string;
  count: number;
  itemsSelledCount: number;
  totalPrice: number;
  profit: number;
  year: number,
  month: number;
  day: number,
  timestamp: number;
  items: ItemSale[];
}