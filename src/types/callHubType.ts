import { FormDataItem } from "../components/dashboard/menu/button_menu/type/formData";
import { PlaybookMetaWithUseRecord } from "../components/playbook/types/plabookMeta_with_useRecord";

type saveArticleData = {
  title: string;
  body: string;
  images: {
    type: string;
    imageId: string;
    fileName: string;
    base64: string;
  }[];
};
export type callHubType =
  | FormData
  | string
  | Blob
  | FormDataItem
  | PlaybookMetaWithUseRecord
  | { email: string; password?: string; provider?: string }
  | { title: string; body: string; language: string }
  | { title: string; body: string }
  | object[]
  | saveArticleData;
