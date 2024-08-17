"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";

interface FlashcardSet {
  id: string;
  name: string;
  flashcards: {
    front: string;
    back: string;
  }[];
}

const FlashcardSetDetails = () => {
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [cardStates, setCardStates] = useState<{ [key: number]: boolean }>({});

  const { data: session } = useSession();
  const userEmail: { email: string } | undefined = session?.user
    ? { email: session.user.email || "" }
    : undefined;
  const userDocRef = userEmail ? doc(db, "users", userEmail.email) : null;
  const flashcardSetsCollectionRef = userDocRef
    ? collection(userDocRef, "flashcardSets")
    : null;
  const { id } = useParams();
  console.log("Params:", id);

  useEffect(() => {
    const fetchFlashcardSetDetails = async (user: { email: string }) => {
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

        setFlashcardSet(sets.find((set) => set.id === id) as FlashcardSet);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };

    if (userDocRef && flashcardSetsCollectionRef) {
      fetchFlashcardSetDetails({ email: session?.user?.email || "" });
    }
  }, []);

  const handleFlipClick = (index: number) => {
    setCardStates((prevCardStates) => ({
      ...prevCardStates,
      [index]: !prevCardStates[index],
    }));
  };

  return (
    <main className="w-screen max-w-[80rem] min-h-screen flex py-12 mx-auto">
      <div className="flex flex-col w-full">
        <h2 className="pb-6 text-4xl font-semibold uppercase">
          Let&apos;s study some&nbsp;{flashcardSet?.name.toUpperCase()}
          <p className="text-xl"></p>
        </h2>
        {flashcardSet && (
          <div className="grid grid-cols-4 gap-4">
            {flashcardSet?.flashcards.map((flashcard, index) => {
              const isFlipped = cardStates[index] ?? false;
              return (
                <div key={index} className="w-full">
                  <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
                    <div
                      onClick={() => handleFlipClick(index)}
                      className="min-w-[18rem] max-w-[18rem] min-h-[18rem] px-2 rounded-xl border-2 border-neutral-400 flex flex-col justify-center relative bg-white cursor-pointer hover:brightness-110 transition duration-200 shadow-md shadow-zinc-300"
                    >
                      <div className="bg-blue-200 w-full h-[16.7rem] flex flex-col justify-center px-2 rounded-lg bg-[url('/images/elephant.webp')] bg-no-repeat bg-center">
                        <div className="w-full absolute top-3 flex">
                          <p className="text-xs">{flashcardSet.name}</p>
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
                      className="min-w-[18rem] max-w-[18rem] min-h-[18rem] px-2 rounded-xl border-2 border-neutral-400 flex flex-col justify-center relative bg-white cursor-pointer hover:brightness-110 transition duration-200 shadow-md shadow-zinc-300"
                    >
                      <div className="bg-yellow-100 w-full h-[16.7rem] flex flex-col justify-center px-2 rounded-lg bg-[url('/images/elephant2.webp')] bg-no-repeat bg-center">
                        <div className="w-full absolute top-3 flex">
                          <p className="text-xs">{flashcardSet.name}</p>
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
        )}
      </div>
    </main>
  );
};

export default FlashcardSetDetails;
