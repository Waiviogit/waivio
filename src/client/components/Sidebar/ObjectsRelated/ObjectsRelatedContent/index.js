import { connect } from 'react-redux';

import ObjectsRelatedContent from './ObjectsRelatedContent';
import {
  getRelatedObjectsForSidebar,
  getRelatedObjectsIsLoading,
} from '../../../../../store/wObjectStore/wObjectSelectors';

const mapStateToProps = state => ({
  isLoading: getRelatedObjectsIsLoading(state),
  objects: getRelatedObjectsForSidebar(state),
});

export default connect(mapStateToProps)(ObjectsRelatedContent);
