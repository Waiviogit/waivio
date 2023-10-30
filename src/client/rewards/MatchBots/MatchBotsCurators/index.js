import { connect } from 'react-redux';

import MatchBotsCurators from './MatchBotsCurators';
import { getIsEngLocale } from '../../../../store/appStore/appSelectors';
import {
  getAuthenticatedUserName,
  getIsConnectMatchBot,
} from '../../../../store/authStore/authSelectors';
import { MATCH_BOTS_NAMES, MATCH_BOTS_TYPES } from '../../../../common/helpers/matchBotsHelpers';
import { getMatchBotsSelector } from '../../../../store/rewardsStore/rewardsSelectors';
import { clearMatchBots, getMatchBots } from '../../../../store/rewardsStore/rewardsActions';
import { reload } from '../../../../store/authStore/authActions';

const mapStateToProps = state => ({
  isEngLocale: getIsEngLocale(state),
  matchBots: getMatchBotsSelector(state),
  authUserName: getAuthenticatedUserName(state),
  isAuthority: getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.CURATORS }),
});

const mapDispatchToProps = dispatch => ({
  clearMatchBots: () => dispatch(clearMatchBots()),
  reload: () => dispatch(reload()),
  getMatchBots: () => dispatch(getMatchBots(MATCH_BOTS_NAMES.CURATORS)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchBotsCurators);
