"use client";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
  writeBatch,
  addDoc,
} from "firebase/firestore";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { generateFlashcards } from "../actions";
import { db } from "../firebase";

interface Flashcard {
  front: string;
  back: string;
}

interface User {
  id: string;
  flashcardSets: { name: string; id: string; email: string }[];
  name?: string;
  email?: string;
  image?: string;
}

export default function Generate() {
  const [prompt, setPrompt] = useState<string>("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [setName, setSetName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data: session } = useSession();
  const user = session?.user?.email;
  console.log("User:", user);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const saveFlashcards = async (
    user: { email: string },
    setName: string | undefined,
    flashcards: any[]
  ) => {
    if (!user || !user.email || !setName) {
      console.error("Missing user or setName");
      return;
    }
    try {
      const batch = writeBatch(db);

      const userDocRef = doc(collection(db, "users"), user.email);
      const flashcardSetsCollectionRef = collection(
        userDocRef,
        "flashcardSets"
      );

      const setDocRef = await addDoc(flashcardSetsCollectionRef, {
        name: setName,
        flashcards: flashcards,
      });

      batch.set(userDocRef, {
        flashcardSets: arrayUnion({
          name: setName,
          id: setDocRef.id,
        }),
      });

      await batch.commit();
      setMessage(`${setName} has been saved to your account.`);
    } catch (error) {
      console.error("Error saving flashcards:", error);
      // Handle error, e.g., display an error message to the user
    }
    setIsModalOpen(false);
  };

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const response = await generateFlashcards(prompt);
      const flashcardsData = response.flashcards;
      setFlashcards(flashcardsData);
      // setPrompt("");
    } catch (error) {
      console.error("Error generating flashcards:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async () => {
    try {
      if (user) {
        const userObject = { email: user };
        await saveFlashcards(userObject, setName, flashcards);
        setIsModalOpen(false);
      } else {
        console.log("No user found");
      }
    } catch (error) {
      console.error("Error saving flashcards:", error);
    }
  };

  return (
    <main className="w-screen max-w-[80rem] mx-auto">
      <div className="my-6 py-12 px-6 rounded border-2 border-blue-300 flex items-center bg-yellow-50">
        <div className="flex flex-col w-1/2">
          <h4 className="pb-4 text-2xl font-semibold uppercase">
            Specify Cards Subject Below
          </h4>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 p-4 mb-2 border border-neutral-700 rounded-lg placeholder:text-center placeholder:uppercase placeholder:text-neutral-800/60 placeholder:pt-5"
            rows={5}
            placeholder="Enter&nbsp;  Flashcards&nbsp;  Subject"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-400 text-neutral-950 uppercase text-lg font-semibold tracking-wider rounded-lg border border-neutral-700 py-2 px-4 hover:bg-blue-500 hover:text-yellow-400 transition duration-200"
          >
            Generate
          </button>
        </div>
        <div className="flex-1">
          <h1 className="text-center">FlashCard Decks Displayed Here</h1>
        </div>
      </div>

      {/* Flashcards Display Here */}
      {flashcards.length > 0 && (
        <div className="w-full rounded ">
          <h2>Generated Flashcards</h2>
          <div>
            {flashcards.map((flashcard, index) => {
              console.log("Flashcard Front:", flashcard.front);
              return (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <div className="max-w-[12rem] min-h-[15rem] p-4 rounded-xl border flex flex-col space-y-3">
                    <h4>{flashcard.front}</h4>
                  </div>
                  <div className="max-w-[12rem] h-auth p-4 rounded-xl border flex flex-col space-y-3">
                    <h6>{flashcard.back}</h6>
                  </div>
                </div>
              );
            })}
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
            <button onClick={(e) => user && handleSave()}>Save</button>
          </div>
        </section>
      )}
    </main>
  );
}
