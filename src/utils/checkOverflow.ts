export default (container?: HTMLElement) => {
  if (container) {
    return container.scrollWidth - 2 > container.clientWidth ;
  }
  return false
}
