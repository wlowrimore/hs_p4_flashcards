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
import Image from "next/image";
import ReactCardFlip from "react-card-flip";
import StockCard from "../../../public/images/stockCard.webp";

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
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [cardStates, setCardStates] = useState<{ [key: number]: boolean }>({});

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

  const handleFlipClick = (index: number) => {
    setCardStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  return (
    <main className="w-screen max-w-[80rem] mx-auto">
      <div className="py-6 px-6 rounded border-2 border-blue-300 flex items-center bg-yellow-50/30">
        <div className="flex flex-col w-1/2">
          <h2 className="pb-12 text-2xl font-semibold uppercase">
            Specify Cards Subject Below
          </h2>
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
      <div className="py-6 px-6 rounded border-2 border-blue-300 flex items-center bg-yellow-50/30">
        {flashcards.length > 0 && (
          <div className="max-w-[80rem] flex flex-col mx-auto justify-center rounded">
            <h2 className="pb-12 text-2xl font-semibold uppercase">
              Generated Flashcards Preview
            </h2>
            <div className="grid grid-cols-4 gap-10 w-full border-b pb-6 border-neutral-700">
              {flashcards.map((flashcard, index) => {
                const isFlipped = cardStates[index] ?? false;
                return (
                  <div key={index} className="w-full">
                    <ReactCardFlip
                      isFlipped={isFlipped}
                      flipDirection="vertical"
                    >
                      <div
                        onClick={() => handleFlipClick(index)}
                        className="min-w-[15rem] max-w-[15rem] min-h-[18rem] p-4 rounded-xl border-2 border-neutral-400 flex flex-col space-y-3 justify-center relative bg-blue-200 cursor-pointer hover:brightness-110 transition duration-200 shadow-md shadow-zinc-300"
                      >
                        <div>
                          <div className="w-full absolute top-2 flex">
                            <p className="text-xs">{prompt}</p>
                            <p className="text-xs font-light absolute right-8">
                              question
                            </p>
                          </div>
                          <h4 className="text-lg">{flashcard.front}</h4>
                        </div>
                      </div>
                      <div
                        onClick={() => handleFlipClick(index)}
                        className="min-w-[15rem] max-w-[15rem] min-h-[18rem] p-4 rounded-xl border-2 border-blue-200 flex flex-col text-center space-y-3 justify-center relative bg-yellow-100 cursor-pointer transition duration-200 hover:brightness-110 shadow-md shadow-zinc-300"
                      >
                        <div>
                          <div className="w-full absolute top-2 flex">
                            <p className="text-xs">{prompt}</p>
                            <p className="text-xs font-light absolute right-8">
                              answer
                            </p>
                          </div>
                          <h6 className="text-lg">{flashcard.back}</h6>
                        </div>
                      </div>
                    </ReactCardFlip>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleOpenModal}
              className="bg-neutral-800 text-white text-xl my-3 uppercase py-2 px-4 rounded-3xl tracking-wide border border-white hover:opacity-90 transition duration-200"
            >
              Save This Deck
            </button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <section className="bg-gradient-to-tr from-amber-400 to-blue-700/90 fixed top-0 bottom-0 right-[50%] translate-x-[50%] h-screen w-screen z-20 text-neutral-950">
          <div className="bg-blue-700/40 w-[60rem] h-screen items-center flex flex-col border-4 border-white/20 justify-center mx-auto">
            <h2 className="pb-6 text-white text-4xl font-semibold uppercase">
              Save Flashcard Deck
            </h2>
            <div className="p-4 rounded">
              <Image
                src={StockCard}
                alt="Stock Card"
                width={200}
                height={200}
                className="w-40 rounded-lg opacity-80 mb-4 shadow shadow-neutral-600"
              />
            </div>
            <div className="text-neutral-950">
              <p className="text-white text-lg">
                Please enter a name for your flashcard deck.
              </p>
              <input
                type="text"
                autoFocus
                className="w-full h-[3rem] flex items-center p-2 rounded-lg outline-none"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="bg-white/30 text-lg uppercase text-black font-bold tracking-wider w-[11rem] rounded-lg py-2 hover:bg-red-700/40 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={(e) => user && handleSave()}
                className="bg-white/30 text-lg uppercase text-black font-bold tracking-wider w-[11rem] rounded-lg py-2 hover:bg-green-500/40 transition duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
