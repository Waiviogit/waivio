import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const MatchBotsCuratorsContent = ({ isEngLocale, intl }) => (
  <div className="MatchBot__text-content">
    <p>
      {isEngLocale && <span>The </span>}
      <span className="fw6">
        {intl.formatMessage({
          id: 'matchBot_title_curators',
          defaultMessage: 'Curators Match Bot',
        })}{' '}
      </span>
      <span>
        {intl.formatMessage({
          id: 'curators_match_bots_meaning',
          defaultMessage:
            'automatically mirrors the upvotes and downvotes of selected users (curators) on both posts and comments. You simply choose which curators you want to follow, and the bot will apply a proportionate version of their voting actions from your account.',
        })}
      </span>
    </p>
    <p>
      {intl.formatMessage({
        id: 'curators_match_bots_command',
        defaultMessage:
          "For each curator, you can choose how your vote should be applied. In proportional mode, the voting ratio determines the strength of your vote in relation to the curator's. A ratio of 100% means your vote will mirror the curator's exactly, while a 200% ratio will double their vote strength on your behalf. In absolute mode, you set a fixed voting strength that will always be used, regardless of the curator's vote value. This ensures that every mirrored vote reflects your selected power consistently. In both modes, votes are capped at a maximum of 100%.",
      })}
    </p>
    <p>
      {intl.formatMessage({
        id: 'curators_match_bots_important',
        defaultMessage:
          'Important: The Curators Match Bot only casts upvotes estimated to have a combined value of at least 0.01 HBD.',
      })}
    </p>
    <p>
      {intl.formatMessage({
        id: 'curators_match_bots_condition',
        defaultMessage:
          'You may also enable the option to repeat downvotes from selected curators if you wish to align fully with their curation behavior.',
      })}
    </p>
    <p>
      {intl.formatMessage({
        id: 'curators_match_bots_votes',
        defaultMessage:
          "Voting will continue as long as your account's voting mana remains above the threshold defined for each curator.",
      })}
    </p>
  </div>
);

MatchBotsCuratorsContent.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
};

export default injectIntl(MatchBotsCuratorsContent);
