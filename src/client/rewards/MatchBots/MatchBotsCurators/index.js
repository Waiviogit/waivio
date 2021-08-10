import { connect } from 'react-redux';

import MatchBotsCurators from './MatchBotsCurators';
import { MATCH_BOTS_TYPES } from '../../../helpers/matchBotsHelpers';
import { getIsEngLocale } from '../../../../store/appStore/appSelectors';
import { getIsConnectMatchBot } from '../../../../store/authStore/authSelectors';

const mapStateToProps = state => ({
  isEngLocale: getIsEngLocale(state),
  isAuthority: getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.CURATORS }),
});

export default connect(mapStateToProps)(MatchBotsCurators);
