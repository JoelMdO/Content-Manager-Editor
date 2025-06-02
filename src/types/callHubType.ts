import { FormDataItem } from "./formData";
import { PlaybookMetaWithUseRecord } from "./plabookMeta_with_useRecord";

export type callHubType =
  | FormData
  | string
  | Blob
  | FormDataItem
  | PlaybookMetaWithUseRecord
  | { email: string; password: string }
  | object[];
