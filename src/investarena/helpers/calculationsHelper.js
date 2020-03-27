/**
 * Decimal adjustment of a number.
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
/* eslint-disable no-param-reassign */
function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](Number(`${value[0]}e${value[1] ? +value[1] - exp : -exp}`));
  // Shift back
  value = value.toString().split('e');
  return Number(`${value[0]}e${value[1] ? +value[1] + exp : exp}`);
}
/* eslint-enable no-param-reassign */

// Decimal round
export function round10(value, exp) {
  return decimalAdjust('round', value, exp);
}

// Decimal floor
export function floor10(value, exp) {
  return decimalAdjust('floor', value, exp);
}

// Decimal ceil
export function ceil10(value, exp) {
  return decimalAdjust('ceil', value, exp);
}

// Format number - fixed amount of digits in number
export function toFixNumberLength(value, digitsLimit = 3) {
  const intSigns = Math.floor(Math.abs(value)).toString().length;
  const fractSigns = digitsLimit - intSigns;
  return Number.parseFloat(value).toFixed(fractSigns > 0 ? fractSigns : 0);
}

export function round(value, decimals = 0) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
