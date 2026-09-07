export type FormDataItem =
  | {
      type:
        | "title"
        | "id"
        | "body"
        | "section"
        | "es_section"
        | "dbName"
        | "es_title"
        | "es_body"
        | "summary"
        | "es_summary";
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
