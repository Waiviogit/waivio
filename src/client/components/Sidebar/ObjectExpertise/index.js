import { connect } from 'react-redux';

import ObjectExpertise from './ObjectExpertise';
import {
  getObjectExpertiseIsLoading,
  getObjectExpertiseUsers,
} from '../../../../store/wObjectStore/wObjectSelectors';
import {
  followUserWObjectExpertise,
  unfollowUserWObjectExpertise,
} from '../../../../store/wObjectStore/wobjActions';

const mapStateToProps = state => ({
  users: getObjectExpertiseUsers(state),
  isLoading: getObjectExpertiseIsLoading(state),
});

const mapDispatchToProps = dispatch => ({
  followExpert: userName => dispatch(followUserWObjectExpertise(userName)),
  unfollowExpert: userName => dispatch(unfollowUserWObjectExpertise(userName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ObjectExpertise);
