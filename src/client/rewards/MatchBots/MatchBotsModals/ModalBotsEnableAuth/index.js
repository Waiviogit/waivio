import { connect } from 'react-redux';

import ModalBotsEnableAuth from './MatchBotsEnableAuth';
import { setMatchBot } from '../../../../../store/rewardsStore/rewardsActions';
import { getIsConnectMatchBot } from '../../../../../store/authStore/authSelectors';

const mapStateToProps = (state, props) => ({
  isAuthority: getIsConnectMatchBot(state, props),
});

const mapDispatchToProps = dispatch => ({
  toggleEnableAuthorBot: payload => dispatch(setMatchBot(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalBotsEnableAuth);
