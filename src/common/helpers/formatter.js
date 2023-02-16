export function jsonParse(input) {
  try {
    return JSON.parse(input);
  } catch (e) {
    return null;
  }
}

export const epochToUTC = epochTimestamp => new Date(0).setUTCSeconds(epochTimestamp);

export const toFixed = (num, symbol = 100) => parseInt(num * symbol, 10) / symbol;
