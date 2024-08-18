"use client";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
  writeBatch,
  addDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { generateFlashcards } from "../actions";
import { db } from "../firebase";
import Image from "next/image";
import ReactCardFlip from "react-card-flip";
import StockCard from "../../../public/images/stockCard.webp";
import Spinner from "../components/ui/Spinner";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardSet {
  id: string;
  name: string;
}

interface User {
  id: string;
  flashcardSets: { name: string; id: string; email: string }[];
  name?: string;
  email?: string;
  image?: string;
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [isSetsFetched, setIsSetsFetched] = useState<boolean>(false);
  const [setsVersion, setSetsVersion] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [showMsg, setShowMsg] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [setName, setSetName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [cardStates, setCardStates] = useState<{ [key: number]: boolean }>({});

  const { data: session } = useSession();
  const router = useRouter();

  const user: { email: string } | undefined = session?.user
    ? { email: session.user.email || "" }
    : undefined;
  const userDocRef = user ? doc(db, "users", user?.email) : undefined;
  const flashcardSetsCollectionRef = userDocRef
    ? collection(userDocRef, "flashcardSets")
    : null;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!isSetsFetched && user) {
      fetchSavedSets({ email: user?.email });
      setIsSetsFetched(true);
    }
  }, [user, isSetsFetched]);

  useEffect(() => {
    const fetchOnSetsUpdate = () => {
      fetchSavedSets(user!);
      setSetsVersion((prevVersion) => prevVersion + 1);
    };
    if (flashcardSetsCollectionRef) {
      const unsubscribe = onSnapshot(
        flashcardSetsCollectionRef,
        fetchOnSetsUpdate
      );
      return () => unsubscribe();
    }
  }, [user, setsVersion]);

  useEffect(() => {
    if (message) {
      setShowMsg(true);
      const timer = setTimeout(() => {
        setShowMsg(false);
      }, 3000);
    }
  }, [message]);

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
      const userDocRef = doc(collection(db, "users"), user.email);
      const flashcardSetsCollectionRef = collection(
        userDocRef,
        "flashcardSets"
      );

      const setDocRef = await addDoc(flashcardSetsCollectionRef, {
        name: setName,
        flashcards: flashcards,
      });

      setMessage(`${setName} has been saved to your account.`);
    } catch (error: any) {
      console.error("Error saving flashcards:", error);
      setMessage(`Error saving flashcards: ${error.message}`);
    }
    setIsModalOpen(false);
  };

  const fetchSavedSets = async (user: { email: string }) => {
    try {
      const userDocRef = doc(db, "users", user?.email);
      const flashcardSetsCollectionRef = collection(
        userDocRef,
        "flashcardSets"
      );

      const snapshot = await getDocs(flashcardSetsCollectionRef);

      const sets = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        ...doc.data(),
      }));

      setFlashcardSets(sets);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };
  async function handleSubmit() {
    setIsLoading(true);
    try {
      const response = await generateFlashcards(prompt);
      if (!response) {
        setMessage("Sorry, I can't help you with that.");
      }
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
        const userObject = { email: user.email };
        await saveFlashcards(userObject, setName, flashcards);
        setIsModalOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleFlashcardSetClick = (selectedSet: FlashcardSet) => {
    router.push(`/set/${selectedSet.id}`);
  };

  if (!session) {
    redirect("/");
  }

  return (
    <main className="w-screen max-w-[80rem] min-h-screen mx-auto flex flex-col justify-center">
      <div className="py-6 px-6 rounded flex bg-yellow-50/30 gap-2 border-t-2 border-r-2 border-l-2 border-neutral-400">
        <div className="flex flex-col w-1/2 border-r-2 border-neutral-400 pr-6">
          <div className="flex items-center mb-4">
            <Image
              src={session?.user?.image!}
              alt={session?.user?.name as string}
              width={44}
              height={44}
              className="rounded-full"
            />
            <h2 className="pb-2 px-2 text-2xl font-semibold uppercase">
              Add Your Card Subject Below
            </h2>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 px-4 pt-9 mb-2 bg-white/60 uppercase text-lg font-semibold text-center rounded-lg placeholder:text-center placeholder:uppercase placeholder:text-neutral-800/40 outline-none"
            rows={5}
            placeholder="Enter&nbsp;  Flashcards&nbsp;  Subject"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-400 text-neutral-950 uppercase text-lg font-semibold tracking-wider rounded-lg border border-neutral-700 py-2 px-4 hover:bg-blue-500 hover:text-yellow-400 transition duration-200"
          >
            {isLoading ? <Spinner /> : "Generate"}
          </button>
        </div>

        {/* Saved Sets Display Here */}
        {flashcardSets.length > 0 ? (
          <div className="flex flex-col w-1/2 justify-start pl-1">
            <h2 className="relative pb-6 px-4 text-2xl font-semibold uppercase">
              Saved Decks
            </h2>
            {showMsg && (
              <div className="absolute top-[16%] px-4 z-20 text-neutral-700">
                {message}
              </div>
            )}
            <div className="flex-1 grid grid-cols-4 px-4 gap-2">
              {flashcardSets.map((flashcardSet, fcIndex) => (
                <div
                  key={fcIndex}
                  onClick={() => handleFlashcardSetClick(flashcardSet)}
                  className="text-center"
                >
                  <div className="bg-[url('/images/elephant.webp')] bg-no-repeat bg-cover bg-center p-2 w-full flex justify-center items-center bg-white/60 rounded-lg cursor-pointer hover:brightness-110 transition duration-200">
                    <h2 className="text-xs min-h-[8rem] flex items-center justify-center font-bold tracking-wider">
                      {flashcardSet.name.toUpperCase()}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="w-1/2 flex justify-center">No Saved Sets</p>
        )}
      </div>

      {/* Generated Flashcards Display Here */}
      <div className="py-6 px-4 rounded flex bg-transparent">
        {flashcards.length > 0 && (
          <div className="bg-gradient-to-bl from-zinc-100 via-gray-400 to-blue-500 border border-neutral-200 flex flex-col mx-auto items-center rounded-lg px-6">
            <h2 className="py-8 text-2xl font-bold tracking-wide uppercase">
              Generated Flashcards Preview for {prompt}
            </h2>
            <div className="grid grid-cols-4 gap-10 border-b pb-6 border-neutral-700">
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
                        className="min-w-[15rem] max-w-[15rem] min-h-[18rem] px-2 rounded-xl border-2 border-neutral-400 flex flex-col justify-center relative bg-white cursor-pointer hover:brightness-110 transition duration-200 shadow-md shadow-neutral-500"
                      >
                        <div className="bg-blue-200 w-full h-[16.7rem] flex flex-col justify-center px-2 rounded-lg bg-[url('/images/elephant.webp')] bg-no-repeat bg-center">
                          <div className="w-full absolute top-3 flex">
                            <p className="text-xs">{prompt}</p>
                            <p className="text-xs font-light absolute right-8">
                              question
                            </p>
                          </div>
                          <h4 className="text-lg text-center">
                            {flashcard.front}
                          </h4>
                        </div>
                      </div>
                      <div
                        onClick={() => handleFlipClick(index)}
                        className="min-w-[15rem] max-w-[15rem] min-h-[18rem] px-2 rounded-xl border-2 border-neutral-400 flex flex-col justify-center relative bg-white cursor-pointer hover:brightness-110 transition duration-200 shadow-md shadow-zinc-300"
                      >
                        <div className="bg-yellow-100 w-full h-[16.7rem] flex flex-col justify-center px-2 rounded-lg bg-[url('/images/elephant2.webp')] bg-no-repeat bg-center">
                          <div className="w-full absolute top-3 flex">
                            <p className="text-xs">{prompt}</p>
                            <p className="text-xs font-light absolute right-8">
                              answer
                            </p>
                          </div>
                          <h6 className="text-lg text-center">
                            {flashcard.back}
                          </h6>
                        </div>
                      </div>
                    </ReactCardFlip>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleOpenModal}
              className="bg-zinc-300 text-neutral-950 text-xl font-semibold tracking-wider text-center my-3 uppercase py-2 px-4 rounded-lg border border-zinc-100 hover:bg-zinc-100 transition duration-200"
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
                className="w-full h-[3rem] flex text-center text-lg font-semibold uppercase p-2 rounded-lg outline-none"
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
