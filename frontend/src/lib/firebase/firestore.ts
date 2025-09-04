import { collection, addDoc, getDocs, query, where, Timestamp, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "./config"; // Your initialized CLIENT-side Firestore instance

const SPENDINGS_COLLECTION = "spendings";

export interface Spending {
  id?: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  timestamp: Timestamp;
}

// Function to add a new spending document
export const addSpending = async (spendingData: Omit<Spending, 'id' | 'timestamp'>) => {
  try {
    await addDoc(collection(db, SPENDINGS_COLLECTION), {
      ...spendingData,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Function to get all spendings for a specific user (CLIENT-SIDE VERSION)
export const getSpendings = async (userId: string): Promise<Spending[]> => {
  try {
    const spendingsQuery = query(
      collection(db, SPENDINGS_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(spendingsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Spending, 'id'>),
    }));
  } catch (error) {
    console.error("Error getting documents: ", error);
    // On the client, we throw the error to be handled by the component
    throw error;
  }
};

// Function to delete a spending document
export const deleteSpending = async (spendingId: string) => {
  try {
    const docRef = doc(db, SPENDINGS_COLLECTION, spendingId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};