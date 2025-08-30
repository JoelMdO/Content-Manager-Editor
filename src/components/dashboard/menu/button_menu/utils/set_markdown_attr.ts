//==========================================
export const setMarkdownAttr = (
  span: HTMLElement,
  type: SetMarkDownAttr,
  enabled: boolean
) => {
  //
  let primary_style: string = type;
  let secondary_style: string = "";
  //
  // switch (type) {
  //   case "bold":
  //   case "italic":
  //     secondary_style = "normal";
  //     break;
  //   case "underline":
  //     secondary_style = "none";
  //     break;
  //   case "font_h2":
  //     primary_style = "1.5em";
  //     secondary_style = "1em";
  //     break;
  //   case "font_h3":
  //     primary_style = "1.17em";
  //     secondary_style = "1em";
  //     break;
  //   case "section":
  // }

  span.style.fontSize = enabled ? primary_style : secondary_style;
  if (enabled) {
    span.classList.add(primary_style);
  } else {
    span.classList.remove(primary_style);
  }
};
