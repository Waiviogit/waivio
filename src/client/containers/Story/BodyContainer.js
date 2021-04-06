import { connect } from 'react-redux';
import Body from '../../components/Story/Body';
import { getRewriteLinks, getExitPageSetting } from '../../store/reducers';
import { getAppUrl } from '../../store/appStore/appSelectors';

export default connect(state => ({
  appUrl: getAppUrl(state),
  rewriteLinks: getRewriteLinks(state),
  exitPageSetting: getExitPageSetting(state),
}))(Body);
