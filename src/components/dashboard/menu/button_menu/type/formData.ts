export type FormDataItem =
  | {
      type: "title" | "id" | "body" | "italic" | "bold" | "dbName";
      content: string;
    }
  | { type: "image"; fileName: string };
