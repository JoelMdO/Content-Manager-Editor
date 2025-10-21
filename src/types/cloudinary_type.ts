export type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  [key: string]: string | number | string[] | undefined;
};

export type CloudinarySearchResponse = {
  resources: CloudinaryResource[];
  [key: string]: string | number | CloudinaryResource[] | undefined;
};
