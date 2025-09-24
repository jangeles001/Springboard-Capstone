export function shouldLoadMore(
  scrollTop,
  scrollHeight,
  clientHeight,
  threshold = 0.8
) {
  return scrollTop + clientHeight >= scrollHeight * threshold;
}
