import { connect } from 'react-redux';

import ObjectExpertise from './ObjectExpertise';
import { followExpert, unfollowExpert } from '../../../store/userStore/userActions';

const mapDispatchToProps = dispatch => ({
  followExpert: userName => dispatch(followExpert(userName)),
  unfollowExpert: userName => dispatch(unfollowExpert(userName)),
});

export default connect(null, mapDispatchToProps)(ObjectExpertise);
