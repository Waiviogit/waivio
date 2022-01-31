import { connect } from 'react-redux';

import MatchBotsAuthors from './MatchBotsAuthors';
import { getIsEngLocale } from '../../../../store/appStore/appSelectors';
import { getIsConnectMatchBot } from '../../../../store/authStore/authSelectors';
import { getMatchBotsSelector } from '../../../../store/rewardsStore/rewardsSelectors';
import { MATCH_BOTS_NAMES, MATCH_BOTS_TYPES } from '../../../../common/helpers/matchBotsHelpers';
import { clearMatchBots, getMatchBots } from '../../../../store/rewardsStore/rewardsActions';

const mapStateToProps = state => ({
  isEngLocale: getIsEngLocale(state),
  isAuthority: getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.AUTHORS }),
  matchBots: getMatchBotsSelector(state),
});

const mapDispatchToProps = dispatch => ({
  clearMatchBots: () => dispatch(clearMatchBots()),
  getMatchBots: () => dispatch(getMatchBots(MATCH_BOTS_NAMES.AUTHORS)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchBotsAuthors);
