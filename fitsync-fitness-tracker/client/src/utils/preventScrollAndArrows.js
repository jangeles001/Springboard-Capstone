export const preventScrollAndArrows = {
  onKeyDown: (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) || e.target.value.length === 3) {
      e.preventDefault();
    }
  },
  onWheel: (e) => e.preventDefault(),
};