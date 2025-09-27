import { Sales } from "./Sales";

export type Day = {
  day: number;
  itemsSelledCount: number;
  totalPrice: number;
  profit: number;
  sales: Sales[];
}