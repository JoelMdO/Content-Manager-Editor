//==========================================
export const setMarkdownAttr = (
  span: HTMLElement,
  type: SetMarkDownAttr,
  enabled: boolean
) => {
  //
  let primary_style: string = type;

  if (enabled) {
    span.classList.add(primary_style);
  } else {
    span.classList.remove(primary_style);
  }
};
