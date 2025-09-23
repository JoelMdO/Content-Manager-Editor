function slugify(text: string): string {
  return text
    .normalize("NFD") // split accents from letters
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-zA-Z0-9\- ]/g, "") // remove symbols except dash/space
    .trim()
    .replace(/\s+/g, "-") // spaces → dashes
    .toLowerCase();
}

export default slugify;
