import { connect } from 'react-redux';

import MatchBotsAuthors from './MatchBotsAuthors';
import { MATCH_BOTS_NAMES, MATCH_BOTS_TYPES } from '../../../helpers/matchBotsHelpers';
import { getIsEngLocale } from '../../../../store/appStore/appSelectors';
import { getIsConnectMatchBot } from '../../../../store/authStore/authSelectors';
import { getMatchBots } from '../../../../store/rewardsStore/rewardsActions';

const mapStateToProps = state => ({
  isEngLocale: getIsEngLocale(state),
  isAuthority: getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.AUTHORS }),
});

const mapDispatchToProps = dispatch => ({
  getMatchBots: () => dispatch(getMatchBots(MATCH_BOTS_NAMES.AUTHORS)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchBotsAuthors);
