import { collection, addDoc, getDocs, query, where, Timestamp, orderBy } from "firebase/firestore";
import { db } from "./config"; // Your initialized Firestore instance

const SPENDINGS_COLLECTION = "spendings";

// Interface for type safety
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
      timestamp: Timestamp.now(), // Add server timestamp
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Function to get all spendings for a specific user
export const getSpendings = async (userId: string): Promise<Spending[]> => {
  try {
    const spendingsQuery = query(
      collection(db, SPENDINGS_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc") // Show most recent first
    );

    const querySnapshot = await getDocs(spendingsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Spending, 'id'>),
    }));
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};