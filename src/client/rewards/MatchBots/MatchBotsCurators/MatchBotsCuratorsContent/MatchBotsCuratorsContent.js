import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const MatchBotsCuratorsContent = ({ isEngLocale, intl }) => (
  <div className="MatchBot__text-content">
    <p>
      {isEngLocale && <span>The</span>}
      <span className="fw6">
        {intl.formatMessage({
          id: 'matchBot_title_curators',
          defaultMessage: ' Curators match bot',
        })}{' '}
      </span>
      <span>
        {intl.formatMessage({
          id: 'curators_match_bots_meaning',
          defaultMessage:
            'automatically repeats the upvotes and downvotes of specified users (curators) on posts and comments.',
        })}
      </span>
    </p>
    <p>
      {intl.formatMessage({
        id: 'curators_match_bots_command',
        defaultMessage:
          "For each curator, please specify the voting ratio - the proportion of your vote to the curator's vote. For example, 100% means that you want the same vote as the curator. Sometimes, if your vote value is less than the curator's, you can amplify your vote. If you specified a 200% vote ratio and the curator voted 10%, your vote would be 20%. Please note that all votes are capped at a maximum of 100%.",
      })}
    </p>
    <p>
      {intl.formatMessage({
        id: 'curators_match_bots_important',
        defaultMessage:
          'Important: If the estimated value of the vote is less than 0.01 HBD, the Curator match bot will skip this vote.',
      })}
    </p>
    <p>
      {intl.formatMessage({
        id: 'curators_match_bots_condition',
        defaultMessage:
          'If you also want to repeat curator’s downvotes, please check the corresponding box.',
      })}
    </p>
    <p>
      {intl.formatMessage({
        id: 'curators_match_bots_votes',
        defaultMessage:
          'Votes will be processed as long as the mana (voting power) on the account remains above the threshold specified for each curator.',
      })}
    </p>
  </div>
);

MatchBotsCuratorsContent.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
};

export default injectIntl(MatchBotsCuratorsContent);
