import { connect } from 'react-redux';

import MatchBotsCurators from './MatchBotsCurators';
import { getIsEngLocale } from '../../../../store/appStore/appSelectors';

const mapStateToProps = state => ({
  isEngLocale: getIsEngLocale(state),
});

export default connect(mapStateToProps)(MatchBotsCurators);
