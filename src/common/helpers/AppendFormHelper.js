import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isMobile } from './apiHelpers';

export const andLayout = compareItems =>
  compareItems > 0 &&
  !isMobile() && (
    <div className={`NewsFiltersRule__line-and`}>
      <FormattedMessage id="and" defaultMessage="and" />
    </div>
  );
export const orLayout = compareItems =>
  compareItems > 0 &&
  !isMobile() && (
    <div className={`NewsFiltersRule__line-and`}>
      <FormattedMessage id="or" defaultMessage="or" />
    </div>
  );
