import { connect } from 'react-redux';

import MatchBotsCurators from './MatchBotsCurators';
import { getIsEngLocale } from '../../../../store/appStore/appSelectors';
import { getMatchBots } from '../../../../store/rewardsStore/rewardsActions';
import { getIsConnectMatchBot } from '../../../../store/authStore/authSelectors';
import { MATCH_BOTS_NAMES, MATCH_BOTS_TYPES } from '../../../helpers/matchBotsHelpers';
import { getMatchBotsSelector } from '../../../../store/rewardsStore/rewardsSelectors';

const mapStateToProps = state => ({
  isEngLocale: getIsEngLocale(state),
  matchBots: getMatchBotsSelector(state),
  isAuthority: getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.CURATORS }),
});

const mapDispatchToProps = dispatch => ({
  getMatchBots: () => dispatch(getMatchBots(MATCH_BOTS_NAMES.CURATORS)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchBotsCurators);
