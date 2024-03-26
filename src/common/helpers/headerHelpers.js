import React from 'react';
import { truncate } from 'lodash';

export const getMenuLinkTitle = (i, intl, length) => {
  switch (i.name) {
    case 'Legal':
      return (
        <div>{intl.formatMessage({ id: 'legal', defaultMessage: 'Legal' }).toUpperCase()} </div>
      );
    case 'Home':
      return <div>{intl.formatMessage({ id: 'home', defaultMessage: 'Home' }).toUpperCase()} </div>;
    default:
      return (
        <div>
          {truncate(i.name, {
            length,
            separator: '...',
          }).toUpperCase()}
        </div>
      );
  }
};

export default null;
