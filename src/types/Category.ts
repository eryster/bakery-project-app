import { Item } from "./Item"

export type Category = {
    id: number,
    name: string;
    items: Item[];
}