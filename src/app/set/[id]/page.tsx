"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useState, useEffect } from "react";

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

  return (
    <div>
      <h1>Details Page</h1>
      {flashcardSet && (
        <div>
          <h2>{flashcardSet?.name.toUpperCase()}</h2>
          {flashcardSet?.flashcards.map((flashcard, index) => (
            <div key={index}>
              <p>{flashcard.front}</p>
              <p>{flashcard.back}</p>
            </div>
          ))}
        </div>
      )}
      <p>{id}</p>
    </div>
  );
};

export default FlashcardSetDetails;

// const FlashcardSetDetails = () => {
//   const { id } = useParams();
//   const { data: session } = useSession();

//   const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
//   const [error, setError] = useState<any>();

//   useEffect(() => {
//     const fetchFlashcardSet = async () => {
//       const userEmail = session?.user?.email;

//       if (userEmail && id) {
//         try {
//           const usersCollection = collection(db, "users");
//           const userDoc = doc(usersCollection, userEmail);
//           const flashcardSetsCollection = collection(
//             userDoc,
//             "flashcardSets"
//           ).withConverter(flashcardSetConverter);
//           const docRef = doc(flashcardSetsCollection, id);

//           console.log("User email:", userEmail);
//           console.log("Flashcard set ID:", id);
//           console.log("Flashcard set docRef:", docRef);

//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             setFlashcardSet(docSnap.data() as FlashcardSet);
//           } else {
//             console.log("No such document!");
//           }
//         } catch (error) {
//           setError(error);
//           console.error("Error fetching flashcard set:", error);
//         }
//       }
//     };

//     fetchFlashcardSet();
//   }, [id, session]);

//   return (
//     <div>
//       <h1>Details Page</h1>
//       {flashcardSet && (
//         <div>
//           <h2>{flashcardSet?.title}</h2>
//           <p>{flashcardSet?.id}</p>
//         </div>
//       )}
//       {error && <p>Error: {error.message}</p>}
//       <p>{id}</p>
//     </div>
//   );
// };
