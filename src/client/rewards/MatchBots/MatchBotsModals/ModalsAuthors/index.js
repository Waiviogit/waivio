import { connect } from 'react-redux';

import ModalsAuthors from './ModalsAuthors';
import { setMatchBot, unsetMatchBot } from '../../../../../store/rewardsStore/rewardsActions';

const mapDispatchToProps = dispatch => ({
  addAuthorBot: payload => dispatch(setMatchBot(payload)),
  deleteAuthorBot: name => dispatch(unsetMatchBot(name, 'author')),
});

export default connect(null, mapDispatchToProps)(ModalsAuthors);
