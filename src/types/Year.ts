import { Month } from "./Month";

export type Year = {
  year: number;
  itemsSelledCount: number;
  totalPrice: number;
  profit: number;
  months: Month[];
}