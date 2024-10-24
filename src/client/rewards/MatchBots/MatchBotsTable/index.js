import { connect } from 'react-redux';

import MatchBotsTable from './MatchBotsTable';
import {
  getMatchBotsHasMoreSelector,
  getMatchBotsSelector,
} from '../../../../store/rewardsStore/rewardsSelectors';
import { getMatchBotsLoadMore } from '../../../../store/rewardsStore/rewardsActions';

const mapStateToProps = state => ({
  bots: getMatchBotsSelector(state),
  hasMore: getMatchBotsHasMoreSelector(state),
});

export default connect(mapStateToProps, { getMatchBotsLoadMore })(MatchBotsTable);
