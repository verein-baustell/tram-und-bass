export default (container?: HTMLElement) => {
  if (container) {
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    const isOverflowing = scrollWidth > clientWidth;
    const overflowRatio = isOverflowing ? scrollWidth - clientWidth : 0;

    return { isOverflowing, overflowRatio };
  }
  return { isOverflowing: false, overflowRatio: 1 };
};