export const preventScrollAndArrows = {
  onKeyDown: (e) => {
    const highlightedText = window.getSelection().toString().trim();

    if (
      !highlightedText &&
      (["ArrowUp", "ArrowDown"].includes(e.key) ||
        (e.target.value.length === 3 && e.key !== "Backspace"))
    ) {
      e.preventDefault();
    }
  },
  onWheel: (e) => e.preventDefault(),
};
