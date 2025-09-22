export type FormDataItem =
  | {
      type:
        | "title"
        | "id"
        | "body"
        | "section"
        | "es-section"
        | "dbName"
        | "es-title"
        | "es-body"
        | "summary"
        | "es-summary";
      content: string;
    }
  | {
      type: `image-${string}`;
      imageId: string;
      blobUrl: string;
      base64: string;
      fileName: string;
    };

export type FormDataImageItem = {
  type: `image-${string}`;
  imageId: string;
  blobUrl: string;
  base64: string;
  fileName: string;
};
