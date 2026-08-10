import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";
import { CustomImage } from "./ImageExtension";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);

export const createDashboardEditorExtensions = () => [
  StarterKit.configure({
    codeBlock: false,
    link: false,
    underline: false,
  }),
  Underline,
  Link.configure({ openOnClick: false }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  CodeBlockLowlight.configure({ lowlight }),
  CustomImage.configure({
    inline: true,
    resize: {
      enabled: true,
      alwaysPreserveAspectRatio: true,
    },
  }),
];
