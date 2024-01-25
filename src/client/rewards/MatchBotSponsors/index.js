import { connect } from 'react-redux';

import MatchBotSponsors from './MatchBotSponsors';
import { MATCH_BOTS_TYPES } from '../../../common/helpers/matchBotsHelpers';
import { getIsEngLocale } from '../../../store/appStore/appSelectors';
import { getIsConnectMatchBot } from '../../../store/authStore/authSelectors';
import { reload } from '../../../store/authStore/authActions';

const mapStateToProps = state => ({
  isEngLocale: getIsEngLocale(state),
  isAuthority: getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.SPONSORS }),
});
const mapDispatchToProps = dispatch => ({
  reload: () => dispatch(reload()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchBotSponsors);
