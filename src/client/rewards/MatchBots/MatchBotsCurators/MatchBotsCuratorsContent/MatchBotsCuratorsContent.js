import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const MatchBotsCuratorsContent = ({ isEngLocale, intl }) => (
  <div className="MatchBot__text-content">
    <p>
      {isEngLocale && <span>The</span>}
      <span className="fw6">{intl.formatMessage({ id: 'matchBot_title_curators' })} </span>
      <span>{intl.formatMessage({ id: 'curators_match_bots_meaning' })}</span>
    </p>
    <p>{intl.formatMessage({ id: 'curators_match_bots_command' })}</p>
    <p>{intl.formatMessage({ id: 'curators_match_bots_important' })}</p>
    <p>{intl.formatMessage({ id: 'curators_match_bots_condition' })}</p>
    <p>{intl.formatMessage({ id: 'curators_match_bots_votes' })}</p>
  </div>
);

MatchBotsCuratorsContent.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
};

export default injectIntl(MatchBotsCuratorsContent);
