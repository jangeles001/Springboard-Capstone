export const preventScrollAndArrows = {
  onKeyDown: (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  },
  onWheel: (e) => e.preventDefault(),
};