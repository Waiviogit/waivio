import { connect } from 'react-redux';
import Body from '../../components/Story/Body';
import { getAppHost, getSafeLinksFromState } from '../../../store/appStore/appSelectors';
import {
  getExitPageSetting,
  getRewriteLinks,
} from '../../../store/settingsStore/settingsSelectors';
import { sendPostError } from '../../../store/postsStore/postActions';

export default connect(
  state => ({
    appUrl: getAppHost(state),
    rewriteLinks: getRewriteLinks(state),
    exitPageSetting: getExitPageSetting(state),
    safeLinks: getSafeLinksFromState(state),
  }),
  { sendPostError },
)(Body);
