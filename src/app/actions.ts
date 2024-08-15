"use server";

import { ChatOpenAI } from "@langchain/openai";

const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFlashcards(prompt: string) {
  try {
    prompt = `You are a flashcard creator. Generate 12 flashcards for a ${prompt} subject.  Each flashcard should have a front and back with the front containing the question and the back containing the answer.  Both front and back should be one sentence long.  The output should be in the following JSON format:
     {
      "flashcards": {
        "front": "Front of the card",
        "back": "Back of the card"
      }
     }`;
    const response = await chatModel.invoke(prompt);
    const data = JSON.parse(response.content as string);
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
}
