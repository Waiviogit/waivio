import React from 'react';
import { PlatformHelper } from './platformHelper';

export function ParsingPriceHelper() {}

export function quoteFormat(price, quoteSettings) {
  if (price === '-' || !quoteSettings) {
    return <span>&ndash;</span>;
  }
  return (
    <span className="st-first-number-favorites">
      {PlatformHelper.exponentialToDecimal(price)}
    </span>
  );
}
