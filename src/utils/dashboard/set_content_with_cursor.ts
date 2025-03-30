  const setContentWithCursorPreservation = (
    ref: React.RefObject<HTMLDivElement>, 
    content: string,
  ) => {
    ///========================================================
    // Function to set content and preserve cursor position
    ///========================================================
    if (ref.current) {
      // Store current selection
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const currentOffset = range?.startOffset ?? 0;
      const currentContainer = range?.startContainer;

      // Set content
      ref.current.innerHTML = content;

      // Restore cursor position
      if (selection && range) {
        const newRange = document.createRange();
        newRange.setStart(currentContainer!, currentOffset);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  };

  export default setContentWithCursorPreservation;