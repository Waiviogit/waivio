import React from 'react';

export function ParsingPriceHelper() {}

export function quoteFormat(price, quoteSettings) {
  if (price === '-' || !quoteSettings) {
    return <span>&ndash;</span>;
  }
  const rate = ParsingPriceHelper.parseRate(
    price,
    quoteSettings.tickSize,
    quoteSettings.priceRounding / 1000000,
  );
  if (rate) {
    const dot = rate.dot === 0 ? '' : '.';
    return (
      <span>
        <span className="st-first-number-favorites">{rate.small}</span>
        <span className="st-second-number-favorites">{dot + rate.big}</span>
        <span className="st-third-number-favorites">{rate.mid}</span>
      </span>
    );
  }
}

ParsingPriceHelper.parseRate = function(val, tick, rounding) {
  if (typeof val === 'string') {
    try {
      val = parseFloat(val);
    } catch (e) {
      return {
        result: '-',
      };
    }
  }
  const temp = getTrimmedPrice(val, rounding, tick);
  if (!isNaN(temp)) {
    val = temp;
  } else {
    val = `${val}`;
  }

  const pt = val.indexOf('.');
  let midSize = '';
  let dot = 0;
  if (pt > 0) {
    const difference = tick === 1000 ? 6 : 7;
    const toRemove = Math.max(0, parseInt(val.replace('.', '')).toFixed(0).length - difference);
    const lastIndex = val.length - 1;
    if (lastIndex - pt >= toRemove) {
      val = val.substr(0, val.length - toRemove);
    }
    let smallSize = '';
    let bigSize = '';
    const arr = val.split('.');
    const decLen = arr[1].length;
    if (decLen > 2) {
      const fDec = decLen - 3;
      smallSize = `${arr[0]}.${arr[1].substr(0, fDec)}`;
      bigSize = arr[1].substr(fDec, 2);
      midSize = arr[1].substr(decLen - 1, 1);
    } else if (decLen === 2) {
      dot = 1;
      smallSize = arr[0];
      bigSize = arr[1];
    } else {
      dot = 2;
      const intLen = arr[0].length;
      smallSize = arr[0].substr(0, intLen - 2);
      bigSize = arr[0].substr(intLen - 2, 2);
      midSize = arr[1];
    }
    return {
      small: smallSize,
      big: bigSize,
      mid: midSize,
      dot,
    };
  }
  return undefined;
};

const getTrimmedPrice = function(value, rounding, tick, dindex) {
  const t = rounding * 1000000;
  let len;
  if (tick > 1000) {
    if (rounding === 1) {
      len = 2;
    } else {
      len = 3;
    }
  } else {
    len = 5;
  }
  const val = Math.round(value * t) / t;
  return val.toFixed(dindex !== undefined ? dindex : len);
};
