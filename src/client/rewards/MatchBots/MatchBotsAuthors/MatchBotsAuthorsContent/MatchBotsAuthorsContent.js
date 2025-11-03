import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const MatchBotsAuthorsContent = ({ intl, isEngLocale }) => (
  <div className="MatchBot__text-content">
    <p>
      {isEngLocale && <span>The </span>}
      <span className="fw6">
        {intl.formatMessage({
          id: 'matchBot_title_authors',
          defaultMessage: 'Authors Match Bot',
        })}{' '}
      </span>
      <span>
        {intl.formatMessage({
          id: 'authors_match_bots_meaning',
          defaultMessage:
            'automatically upvotes posts published by specified authors. It does not upvote comments or reblogs.',
        })}
      </span>
    </p>
    <p>
      {intl.formatMessage({
        id: 'authors_match_bots_command',
        defaultMessage:
          'For each author, you can set an upvote weight ranging from +1% to +100% (maximum vote). The actual vote value will depend on the current voting mana available on your account at the moment the vote is cast.',
      })}
    </p>
    <p>
      {intl.formatMessage({
        id: 'authors_match_bots_important',
        defaultMessage:
          'Important: The Authors Match Bot only casts upvotes estimated to have a combined value of at least 0.01 HBD.',
      })}
    </p>
    <p>
      {intl.formatMessage({
        id: 'authors_match_bots_votes',
        defaultMessage:
          'Voting will continue as long as your account’s voting mana remains above the threshold defined for each author.',
      })}
    </p>
  </div>
);

MatchBotsAuthorsContent.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
};

export default injectIntl(MatchBotsAuthorsContent);
