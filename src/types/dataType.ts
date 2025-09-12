import { PlaybookMetaWithUseRecord } from "../components/playbook/types/plabookMeta_with_useRecord";

export type dataType =
  | string
  | File
  | FormData
  | { email: string; password: string }
  | PlaybookMetaWithUseRecord
  | { title: string; body: string; language?: string }
  | { status: number; message: string | PlaybookMetaWithUseRecord | object };
