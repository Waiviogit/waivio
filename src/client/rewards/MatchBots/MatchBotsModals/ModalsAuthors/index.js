import { connect } from 'react-redux';

import ModalsAuthors from './ModalsAuthors';
import { setMatchBot } from '../../../../../store/rewardsStore/rewardsActions';

const mapDispatchToProps = dispatch => ({
  addAuthorBot: payload => dispatch(setMatchBot(payload)),
});

export default connect(null, mapDispatchToProps)(ModalsAuthors);
