import { connect } from 'react-redux';
import HeroBanner from '../components/HeroBanner';
import { getIsAuthenticated, getIsBannerClosed } from '../reducers';
import { closeBanner } from '../app/appActions';

export default connect(
  state => ({
    visible: !getIsAuthenticated(state) && !getIsBannerClosed(state),
  }),
  dispatch => ({
    onCloseClick: () => dispatch(closeBanner()),
  }),
)(HeroBanner);
