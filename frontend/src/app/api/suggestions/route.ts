import { headers } from 'next/headers';
import { GoogleGenerativeAI } from "@google/generative-ai";
import admin from '@/lib/firebase/firebase-admin-config';
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";



async function getSpendingsForUser(userId: string) {
  const firestore = admin.firestore();
  const spendingsRef = firestore.collection("spendings");
  const snapshot = await spendingsRef
    .where("userId", "==", userId)
    .orderBy("timestamp", "desc")
    .get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}




export async function POST(req: Request) {
  try {
    const headersList = headers();
    const idToken = (await headersList).get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const spendings = await getSpendingsForUser(userId);

    if (!spendings || spendings.length === 0) {
      return new Response(JSON.stringify({ error: "You have no spending data to analyze." }), { status: 400 });
    }
    


    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const prompt = `Based on the following spending data in JSON format, provide three clear, short, and actionable money-saving suggestions. Format the suggestions as a simple JSON string array in your response. Data: ${JSON.stringify(spendings)}`;
    
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    





    const startIndex = responseText.indexOf('[');
    const endIndex = responseText.lastIndexOf(']');
    if (startIndex !== -1 && endIndex !== -1) {
      responseText = responseText.substring(startIndex, endIndex + 1);
    }
    
    return new Response(JSON.stringify({ suggestions: responseText }), { status: 200 });




    
  } catch (error: any) {
    console.error("Error in suggestions API:", error);
    






    if (error.message && (error.message.includes('503') || error.message.includes('overloaded'))) {
      return new Response(JSON.stringify({ error: "The AI is currently overloaded. Please try again in a few moments." }), { status: 503 });
    }

    if (error.code === 'auth/id-token-expired') {
      return new Response(JSON.stringify({ error: "Authentication token expired. Please sign in again." }), { status: 401 });
    }

    return new Response(JSON.stringify({ error: "An unexpected error occurred." }), { status: 500 });
  }
}