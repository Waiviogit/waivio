import React from 'react';
import { truncate } from 'lodash';

const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const getMenuLinkTitle = (i, intl, length, uppercase = true) => {
  const transform = text => (uppercase ? text.toUpperCase() : capitalizeFirst(text));

  switch (i.name) {
    case 'Legal':
      return <div>{transform(intl.formatMessage({ id: 'legal', defaultMessage: 'Legal' }))} </div>;
    case 'Home':
      return <div>{transform(intl.formatMessage({ id: 'home', defaultMessage: 'Home' }))} </div>;
    default:
      return (
        <div>
          {transform(
            truncate(i.name, {
              length,
              separator: '...',
            }),
          )}
        </div>
      );
  }
};

export default null;
