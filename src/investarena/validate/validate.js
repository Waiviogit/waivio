export function validateRegexWithTooltip(element, eventType, regex) {
  element.addEventListener(
    eventType,
    () => {
      if (!regex.test(element.value)) {
        element.classList.add('st-input-danger');
        element.parentElement.setAttribute('data-tooltip', element.getAttribute('data-title'));
      } else {
        element.classList.remove('st-input-danger');
        element.parentElement.removeAttribute('data-tooltip');
      }
    },
    false,
  );
}
