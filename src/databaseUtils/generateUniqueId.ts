import { collection, doc } from "firebase/firestore";
import { db } from "~/services/firebase";

export function generateUniqueId() {
  return doc(collection(db, '_')).id;
}
