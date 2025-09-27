import { Day } from "./Day";

export type Month = {
  month: number;
  itemsSelledCount: number;
  totalPrice: number;
  profit: number;
  days: Day[];
}