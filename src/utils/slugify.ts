export const slugify = ({ value }: { value: string }) => {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_") // Replace non-alphanum with underscore
    .replace(/^_+|_+$/g, "") // Trim leading/trailing underscores
    .replace(/__+/g, "_"); // Collapse multiple underscores
};

export const unslugify = ({ value }: { value: string }) => {
  return value
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim() // Trim leading/trailing spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word
};
