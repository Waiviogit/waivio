import { connect } from 'react-redux';

import MatchBotsTitle from './MatchBotsTitle';
import { getIsConnectMatchBot } from '../../../../store/authStore/authSelectors';

const mapStateToProps = (state, props) => ({
  isAuthority: getIsConnectMatchBot(state, props),
});

export default connect(mapStateToProps)(MatchBotsTitle);
