import { connect } from 'react-redux';

import MatchBotsTable from './MatchBotsTable';
import { getMatchBotsSelector } from '../../../../store/rewardsStore/rewardsSelectors';

const mapStateToProps = (state) => ({
  bots: getMatchBotsSelector(state),
});

export default connect(mapStateToProps)(MatchBotsTable);
