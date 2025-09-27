//==========================================
export const setMarkdownAttr = (
  span: HTMLElement,
  type: SetMarkDownAttr,
  enabled: boolean
) => {
  //
  let primary_style: string = type;
  let secondary_style: string = "";

  // span.style.fontSize = enabled ? primary_style : secondary_style;
  if (enabled) {
    span.classList.add(primary_style);
  } else {
    span.classList.remove(primary_style);
  }
};
