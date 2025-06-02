import { dataType } from "./dataType";

export type postDataType = {
  token: string;
  data: string | FormData | dataType;
  type: string;
};
