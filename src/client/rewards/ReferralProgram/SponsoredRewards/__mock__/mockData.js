// eslint-disable-next-line import/prefer-default-export
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import React from 'react';

export const sponsor = [
  {
    _id: '5f854d0f5110180f72a5e386',
  },
];

export const rewardsTitle = (
  <FormattedMessage
    id="sponsored_rewards_title"
    defaultMessage="Sponsored rewards: {username}"
    values={{
      username: (
        <Link to={`/@vallon`}>
          <span className="title-link">vallon</span>
        </Link>
      ),
    }}
  />
);

export const mockIntl = {
  formatMessage: jest.fn(),
};
