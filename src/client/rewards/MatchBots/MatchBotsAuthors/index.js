import { connect } from 'react-redux';

import MatchBotsAuthors from './MatchBotsAuthors';
import { getIsEngLocale } from '../../../../store/appStore/appSelectors';

const mapStateToProps = state => ({
  isEngLocale: getIsEngLocale(state),
});

export default connect(mapStateToProps)(MatchBotsAuthors);
