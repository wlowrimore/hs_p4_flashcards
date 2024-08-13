"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { doc, collection, getDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

export default function Generate() {
  const [text, setText] = useState<string>("");
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [setName, setSetName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { user } = useUser();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), user?.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      handleCloseModal();
      setSetName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  const handleSubmit = async () => {
    // Call API Here
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  return (
    <main className="max-w-7xl">
      <div className="my-4">
        <h4 className="pb-2 border-b">Generate Flashcards</h4>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 p-4 mb-2 border rounded-xl"
          placeholder="Enter text to generate flashcards"
          rows={4}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 rounded-xl py-2 px-4"
        >
          Generate
        </button>
      </div>

      {/* Flashcards Display Here */}
      {flashcards.length > 0 && (
        <div className="mt-4">
          <h2 className="pb-2 border">Generated Flashcards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {flashcards.map((flashcard, index) => (
              <div key={index} className="bg-white p-4 rounded-xl">
                <h3 className="font-bold">Front</h3>
                <p>{flashcard.front}</p>
                <h3 className="font-bold">Back</h3>
                <p>{flashcard.back}</p>
              </div>
            ))}
          </div>
          <button onClick={handleOpenModal}>Save Flashcards</button>
        </div>
      )}
      {isModalOpen && (
        <section>
          <h2>Save Flashcard Set</h2>
          <div>
            <p>Please enter a name for your flashcard set.</p>
            <textarea
              autoFocus
              className="w-full p-2"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
            />
          </div>
          <div>
            <button onClick={handleCloseModal}>Cancel</button>
            <button onClick={saveFlashcards}>Save</button>
          </div>
        </section>
      )}
    </main>
  );
}
