const sectionQuoteListWrapperHtml = (
  type: SetMarkDownAttr,
  selection: Selection,
  editorRefs?: (HTMLDivElement | null)[]
) => {
  ///========================================================
  // Wrapper to add section, quote or list.
  ///========================================================
  //
  let wrapper: HTMLElement;
  const range = selection?.getRangeAt(0);
  if (!range) return;
  //

  range.deleteContents();
  switch (type) {
    case "section":
      wrapper = document.createElement("hr");
      wrapper.style.height = "10px";
      wrapper.style.width = "100%";
      wrapper.style.display = "block";
      wrapper.style.border = "dashed 1px white";
      break;
    case "list":
      //------------------------------------------
      const fragment = range.cloneContents();
      const parentNode = range.startContainer.parentElement;

      // Check if the parent node is already an ordered list
      if (parentNode?.tagName === "OL") {
        // If it's already an ordered list, remove it
        const olParent = parentNode as HTMLOListElement;
        const parent = olParent.parentNode;
        if (parent) {
          while (olParent.firstChild) {
            parent.insertBefore(olParent.firstChild, olParent);
          }
          parent.removeChild(olParent);
        }
        return;
      }
      //------------------------------------------
      // Purpose: This block creates an ordered list (<ol>) with <li> elements for each selected block (div, span, p) in the content editor.
      //------------------------------------------
      wrapper = document.createElement("ol");
      wrapper.style.marginLeft = "20px";
      if (fragment.childNodes.length > 0) {
        // Iterate over the fragment's child nodes and wrap each block in <li>
        Array.from(fragment.childNodes).forEach((node) => {
          // Only wrap block elements or text nodes with content
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            ["DIV", "P", "SPAN"].includes((node as HTMLElement).tagName)
          ) {
            const li = document.createElement("li");
            li.innerHTML = (node as HTMLElement).innerHTML || "<br>";
            li.style.listStyleType = "decimal";
            li.style.marginLeft = "20px";
            li.style.display = "list-item";
            li.style.color = "white";
            wrapper.appendChild(li);
          } else if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent?.trim()
          ) {
            const li = document.createElement("li");
            li.textContent = node.textContent;
            li.style.listStyleType = "decimal";
            li.style.marginLeft = "20px";
            li.style.display = "list-item";
            li.style.color = "white";
            wrapper.appendChild(li);
          }
        });
        // If no blocks found, create a single empty <li>
      } else {
        const li = document.createElement("li");
        li.style.listStyleType = "decimal";
        li.style.marginLeft = "20px";
        li.style.display = "list-item";
        li.style.color = "white";
        li.innerHTML = "<br>";

        wrapper.appendChild(li);
      }
      break;
    default:
      wrapper = document.createElement("blockquote");
      wrapper.style.borderLeft = "3px solid gray";
      wrapper.style.margin = "8px 0";
      wrapper.style.paddingLeft = "8px";
      wrapper.style.color = "white";
      wrapper.style.fontStyle = "italic";
      const selectedText = range.cloneContents();
      if (selectedText.childNodes.length > 0) {
        wrapper.appendChild(selectedText);
      } else {
        wrapper.textContent = "...";
      }
      break;
  }
  //
  // Inserts the <hr> element at the current cursor position.
  range.insertNode(wrapper);
  const newDiv = document.createElement("div");
  newDiv.innerHTML = "<br>";
  if (wrapper.parentNode) {
    wrapper.parentNode.insertBefore(newDiv, wrapper.nextSibling);
  }
  //
  // Move cursor into the new line
  const sel = window.getSelection();
  if (sel) {
    const newRange = document.createRange();
    newRange.setStart(newDiv, 0);

    if (type !== "section" && type !== "quote") {
      //Moves the cursor to immediately after the <hr> element.
      newRange.setStartAfter(wrapper);
    }
    newRange.collapse(true);

    //
    //Ensures the new range is applied to the selection.
    sel!.removeAllRanges();
    sel!.addRange(newRange);
  }
  //Ensures the correct editor section remains focused.
  editorRefs?.[1]?.focus();
  return;
  // }
};

export default sectionQuoteListWrapperHtml;
