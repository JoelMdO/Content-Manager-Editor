import { PlaybookMeta } from "./plabookMeta";

export interface PlaybookMetaWithUseRecord extends PlaybookMeta {
  useRecord: number | null;
}
