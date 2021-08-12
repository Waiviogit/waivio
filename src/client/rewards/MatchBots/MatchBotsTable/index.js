import { connect } from 'react-redux';

import MatchBotsTable from './MatchBotsTable';
import { getMatchBotsSelector } from '../../../../store/rewardsStore/rewardsSelectors';
import { getIsConnectMatchBot } from '../../../../store/authStore/authSelectors';

const mapStateToProps = (state, props) => ({
  bots: getMatchBotsSelector(state),
  isAuthority: getIsConnectMatchBot(state, props),
});

export default connect(mapStateToProps)(MatchBotsTable);
