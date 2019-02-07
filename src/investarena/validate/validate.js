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
export function validateConfirmPasswordWithTooltip(password, confirmPassword, eventType) {
  password.addEventListener(eventType, () => {
    if (password.value !== confirmPassword.value && confirmPassword.value !== '') {
      confirmPassword.classList.add('st-input-danger');
      confirmPassword.parentElement.setAttribute(
        'data-tooltip',
        confirmPassword.getAttribute('data-confirmation'),
      );
    } else {
      confirmPassword.classList.remove('st-input-danger');
      confirmPassword.parentElement.removeAttribute('data-tooltip');
    }
  });
  confirmPassword.addEventListener(eventType, () => {
    if (password.value !== confirmPassword.value) {
      confirmPassword.classList.add('st-input-danger');
      confirmPassword.parentElement.setAttribute(
        'data-tooltip',
        confirmPassword.getAttribute('data-confirmation'),
      );
    } else {
      confirmPassword.classList.remove('st-input-danger');
      confirmPassword.parentElement.removeAttribute('data-tooltip');
    }
  });
}
export function validateOnlyConfirmPasswordWithTooltip(password, confirmPassword, eventType) {
  confirmPassword.addEventListener(eventType, () => {
    if (password.value !== confirmPassword.value) {
      confirmPassword.classList.add('st-input-danger');
      confirmPassword.parentElement.setAttribute(
        'data-tooltip',
        confirmPassword.getAttribute('data-confirmation'),
      );
    } else {
      confirmPassword.classList.remove('st-input-danger');
      confirmPassword.parentElement.removeAttribute('data-tooltip');
    }
  });
}
export function validateInputNumber(element, eventType) {
  element.addEventListener(eventType, e => {
    if (e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 46) return;
    if (e && e.key && !e.key.match(/[0-9, +]/)) {
      e.preventDefault();
    }
  });
}
export function validateMobileCode(element, eventType) {
  element.addEventListener(eventType, e => {
    if (!e.target.value.includes('+')) {
      element.value = `+${element.value}`;
    }
  });
}
export function validateCustomWithTooltip(element, eventType, func, withEmpty) {
  element &&
    element.addEventListener(eventType, e => {
      if (withEmpty) {
        if (e.target.value.trim() === '') {
          element.classList.add('st-input-danger');
          element.parentElement.setAttribute('data-tooltip', element.getAttribute('data-empty'));
          return;
        }
      }
      const { attribute, result } = func(e.target.value);
      if (!result) {
        element.classList.add('st-input-danger');
        element.parentElement.setAttribute(
          'data-tooltip',
          element.getAttribute(attribute || 'data-custom'),
        );
      } else {
        element.classList.remove('st-input-danger');
        element.parentElement.removeAttribute('data-tooltip');
      }
    });
}
export function validateCustomsWithTooltip(elements, eventType, func) {
  elements.forEach(mainElement => {
    mainElement &&
      mainElement.addEventListener(eventType, () => {
        const values = elements.map(item => item.value);
        if (func(values)) {
          elements.forEach(item => item.classList.remove('st-input-danger'));
          elements.forEach(item => item.parentElement.removeAttribute('data-tooltip'));
        }
      });
  });
}
