import { connect } from 'react-redux';

import ObjectsRelatedContent from './ObjectsRelatedContent';
import {
  getObject,
  getRelatedObjectsForSidebar,
  getRelatedObjectsIsLoading,
} from '../../../../../store/wObjectStore/wObjectSelectors';

const mapStateToProps = state => ({
  currWobject: getObject(state),
  isLoading: getRelatedObjectsIsLoading(state),
  objects: getRelatedObjectsForSidebar(state),
});

export default connect(mapStateToProps)(ObjectsRelatedContent);
