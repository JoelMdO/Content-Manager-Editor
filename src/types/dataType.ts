import { PlaybookMetaWithUseRecord } from "../components/playbook/types/plabookMeta_with_useRecord";

export type dataType =
  | string
  | File
  | FormData
  | { email: string; password: string }
  | PlaybookMetaWithUseRecord
  | { status: number; message: string | PlaybookMetaWithUseRecord | object };
