import { connect } from 'react-redux';

import MatchBotsTitle from './MatchBotsTitle';
import {
  getAuthenticatedUserName,
  getGuestAuthority,
  getIsConnectMatchBot,
  isGuestUser,
} from '../../../../store/authStore/authSelectors';

const mapStateToProps = (state, props) => {
  const isGuest = isGuestUser(state);

  return {
    isAuthority: isGuest ? getGuestAuthority(state) : getIsConnectMatchBot(state, props),
    isGuest: isGuestUser(state),
    authUserName: getAuthenticatedUserName(state),
  };
};

export default connect(mapStateToProps)(MatchBotsTitle);
