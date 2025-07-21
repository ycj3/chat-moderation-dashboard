import { Blocklist } from "./collection";

// Check if any blocklisted word exists
export async function hasBlockedWords(
  text: string
): Promise<{ isExisting: boolean; matchedWords: string[] }> {
  const rawBlocklist = await Blocklist.rawCollection()
    .find({}, { projection: { word: 1 } })
    .toArray();

  const blockedWords = rawBlocklist.map((doc) => doc.word).filter(Boolean);

  let isExisting = false;
  const matchedWords = [];
  for (const word of blockedWords) {
    const isEnglish = /^[a-zA-Z0-9_]+$/.test(word);
    const pattern = isEnglish ? `\\b${word}\\b` : word;
    const regex = new RegExp(pattern, "i");

    if (regex.test(text)) {
      isExisting = true;
      matchedWords.push(word);
    }
  }
  return { isExisting, matchedWords }; // Blocked word found
}

// Replace blocklisted words with ***
export async function replaceBlockedWords(
  text: string
): Promise<{
  updatedText: string;
  matches: { word: string; index: number }[];
}> {
  const rawBlocklist = await Blocklist.rawCollection()
    .find({}, { projection: { word: 1 } })
    .toArray();

  const blockedWords = rawBlocklist.map((doc) => doc.word).filter(Boolean);
  console.log("Blocked words:", blockedWords);

  let updatedText = text;
  const matches = [];

  for (const word of blockedWords) {
    // Use word boundary (\b) for English, omit for Chinese
    const isEnglish = /^[a-zA-Z0-9_]+$/.test(word);
    const pattern = isEnglish ? `\\b${word}\\b` : word;

    const regex = new RegExp(pattern, "gi"); // global, case-insensitive (for English)

    let match;

    // Capture all matches
    while ((match = regex.exec(updatedText)) !== null) {
      matches.push({
        word: match[0],
        index: match.index,
      });
    }

    // Replace word with ***
    updatedText = updatedText.replace(regex, "***");
  }

  return {
    updatedText,
    matches,
  };
}
