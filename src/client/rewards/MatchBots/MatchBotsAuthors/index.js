import { connect } from 'react-redux';

import MatchBotsAuthors from './MatchBotsAuthors';
import { MATCH_BOTS_TYPES } from '../../../helpers/matchBotsHelpers';
import { getIsEngLocale } from '../../../../store/appStore/appSelectors';
import { getIsConnectMatchBot } from '../../../../store/authStore/authSelectors';

const mapStateToProps = state => ({
  isEngLocale: getIsEngLocale(state),
  isAuthority: getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.AUTHORS }),
});

export default connect(mapStateToProps)(MatchBotsAuthors);
