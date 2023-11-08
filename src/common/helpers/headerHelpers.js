import React from 'react';
import { truncate } from 'lodash';

export const getMenuLinkTitle = (i, intl, length) =>
  i.name === 'Legal' ? (
    <div>{intl.formatMessage({ id: 'legal', defaultMessage: 'Legal' }).toUpperCase()} </div>
  ) : (
    <div>
      {truncate(i.name, {
        length,
        separator: '...',
      }).toUpperCase()}
    </div>
  );
export default null;
