const linkWrapperHtml = (
  type: string,
  url: string,
  editableTitle?: string
): HTMLElement => {
  ///========================================================
  // Wrapper to be as container of a link or image
  ///========================================================
  //
  let htmlType: string;
  switch (type) {
    case "link":
      htmlType = "a";
      break;
    default:
      htmlType = "img";
      break;
  }
  //
  const html = document.createElement(htmlType);
  if (htmlType === "a") {
    (html as HTMLAnchorElement).href = url;
    html.style.display = "block";
    html.style.width = "100%";
    html.style.height = "10px";
    html.textContent = editableTitle!;
    html.style.color = "#3B6790";
    html.style.textDecorationColor = "#3B6790";
  }
  const wrapper = document.createElement("div");
  wrapper.style.height = "15px";
  wrapper.style.width = "95%";
  wrapper.style.display = "inline-block";
  wrapper.appendChild(html);
  return wrapper;
};

export default linkWrapperHtml;
