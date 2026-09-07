export type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  [key: string]: string | number | string[] | undefined;
};

export type CloudinarySearchResponse = {
  resources: CloudinaryResource[];
  [key: string]: string | number | CloudinaryResource[] | undefined;
};

export type CloudinaryImage = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  overwritten: boolean;
  api_key: string;
};
