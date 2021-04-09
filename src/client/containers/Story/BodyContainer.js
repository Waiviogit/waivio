import { connect } from 'react-redux';
import Body from '../../components/Story/Body';
import { getAppUrl } from '../../store/appStore/appSelectors';
import { getExitPageSetting, getRewriteLinks } from '../../store/settingsStore/settingsSelectors';

export default connect(state => ({
  appUrl: getAppUrl(state),
  rewriteLinks: getRewriteLinks(state),
  exitPageSetting: getExitPageSetting(state),
}))(Body);
