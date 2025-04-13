
function generateSearchIndex(doc: { title?: string; notes?: string; category?: string }) {
    ///--------------------------------------------------------
    // A function to index the fields of title and notes, to help
    // the search on firebase avoiding retrieving all the documents.
    ///--------------------------------------------------------
    const fieldsToIndex = [doc.title, doc.notes, doc.category];

    const keywords = fieldsToIndex
        .filter(Boolean)
        .map(val => val!.toLowerCase().split(/\s+/))
        .flat();

    const prefixes = keywords.flatMap(word => {
        const len = word.length;
        const min = 4;
        const max = 6;

        if (len < min) return [];
        const end = Math.min(len, max);
        return Array.from({ length: end - min + 1 }, (_, i) => word.slice(0, min + i));
    });

    return Array.from(new Set(prefixes));
};

export default generateSearchIndex;
