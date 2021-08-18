import { connect } from 'react-redux';

import ModalsCurators from './ModalsCurators';
import { setMatchBot, unsetMatchBot } from '../../../../../store/rewardsStore/rewardsActions';

const mapDispatchToProps = dispatch => ({
  addCuratorBot: payload => dispatch(setMatchBot(payload)),
  deleteCuratorBot: name => dispatch(unsetMatchBot(name, 'curator')),
});

export default connect(null, mapDispatchToProps)(ModalsCurators);
