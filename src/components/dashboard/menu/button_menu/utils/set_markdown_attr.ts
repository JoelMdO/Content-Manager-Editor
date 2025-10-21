import { SetMarkDownAttr } from "../type/set_markdown_type";

//==========================================
export const setMarkdownAttr = (
  span: HTMLElement,
  type: SetMarkDownAttr,
  enabled: boolean
) => {
  //
  const primary_style: string = type;

  if (enabled) {
    span.classList.add(primary_style);
  } else {
    span.classList.remove(primary_style);
  }
};
