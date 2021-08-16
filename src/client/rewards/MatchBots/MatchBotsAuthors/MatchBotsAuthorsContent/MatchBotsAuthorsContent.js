import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const MatchBotsAuthorsContent = ({ intl, isEngLocale }) => (
  <div className="MatchBot__text-content">
    <p>
      {isEngLocale && <span>The</span>}
      <span className="fw6">
        {intl.formatMessage({
          id: 'matchBot_title_authors',
          defaultMessage: ' Authors match bot',
        })}{' '}
      </span>
      <span>
        {intl.formatMessage({
          id: 'authors_match_bots_meaning',
          defaultMessage:
            'automatically upvotes posts published by the specified authors. It does not upvote comments or re-blogs.',
        })}
      </span>
    </p>
    <p>
      {intl.formatMessage({
        id: 'authors_match_bots_command',
        defaultMessage:
          'For each author, please specify the upvoting power in the range from +1% to +100% (maximum upvote). Actual value of the upvote depends on the current upvoting mana on the account at the time of the action.',
      })}
    </p>
    <p>
      {intl.formatMessage({
        id: 'authors_match_bots_important',
        defaultMessage:
          'Important: The Authors match bot only publishes upvotes with estimated value of 0.01 HBD or more.',
      })}
    </p>
    <p>
      {intl.formatMessage({
        id: 'authors_match_bots_votes',
        defaultMessage:
          'Votes will be processed as long as the mana (voting power) on the account remains above the threshold as specified for each author.',
      })}
    </p>
  </div>
);

MatchBotsAuthorsContent.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
};

export default injectIntl(MatchBotsAuthorsContent);
