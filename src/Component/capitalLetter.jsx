export const capitalFunction = (word) => {
  if (!word) return "";
  const trimmedWord = word.trim();
  return trimmedWord.charAt(0).toUpperCase() + trimmedWord.slice(1);
};
