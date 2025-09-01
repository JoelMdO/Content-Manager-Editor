import { JWT } from "next-auth/jwt";
import { dataType } from "./dataType";

export type postDataType = {
  token: string | undefined;
  JWT?: string | undefined;
  data: string | FormData | dataType;
  type: string;
};
