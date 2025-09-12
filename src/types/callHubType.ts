import { FormDataItem } from "../components/dashboard/menu/button_menu/type/formData";
import { PlaybookMetaWithUseRecord } from "../components/playbook/types/plabookMeta_with_useRecord";

export type callHubType =
  | FormData
  | string
  | Blob
  | FormDataItem
  | PlaybookMetaWithUseRecord
  | { email: string; password: string }
  | { title: string; body: string; language: string }
  | object[];
