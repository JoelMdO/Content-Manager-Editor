import { dbFireStore } from "../../../../firebaseMain";
import { doc, getDoc } from "firebase/firestore";

export default async function handleNoteClick(id: string) {
  const docRef = doc(dbFireStore, "playbook", id);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const meta = {
      id: id,
      title: snap.data().title,
      category: snap.data().category,
      tags: snap.data().tags,
      lastUpdated: snap.data().lastUpdated,
      steps: snap.data().steps,
      codeSnippets: snap.data().codeSnippets,
      references: snap.data().references,
      notes: snap.data().notes,
    };

    return meta;
  } else {
    return null;
  }
}
