import { orderBy } from 'lodash';
import { connect } from 'react-redux';
import { getDraftPostsSelector } from '../../../store/draftsStore/draftsSelectors';
import LastDrafts from '../../components/Sidebar/LastDrafts';
import { getIsLoaded } from '../../../store/authStore/authSelectors';

const mapStateToProps = state => {
  const sortedDrafts = orderBy(getDraftPostsSelector(state), draft => new Date(draft.lastUpdated), [
    'desc',
  ]);

  return {
    loaded: getIsLoaded(state),
    drafts: sortedDrafts.slice(0, 4),
  };
};

export default connect(mapStateToProps)(LastDrafts);
