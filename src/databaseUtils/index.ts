import { CategoryManager } from "./CategoryManager";
import { SalesManager } from "./SalesManager";
import { generateUniqueId } from "./generateUniqueId";

const categoryManager = new CategoryManager();
const salesManager = new SalesManager();

export { categoryManager, salesManager, generateUniqueId };