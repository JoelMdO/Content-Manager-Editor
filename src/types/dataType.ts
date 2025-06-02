import { PlaybookMetaWithUseRecord } from "./plabookMeta_with_useRecord";

export type dataType =
  | string
  | File
  | FormData
  | { email: string; password: string }
  | PlaybookMetaWithUseRecord
  | { status: number; message: string | PlaybookMetaWithUseRecord | object };
