import { connect } from 'react-redux';

import ObjectsRelated from './ObjectsRelated';
import { clearRelateObjects, getRelatedWobjects } from '../../../../store/wObjectStore/wobjActions';
import {
  getRelatedObjectsArray,
  getRelatedObjectsHasNext,
} from '../../../../store/wObjectStore/wObjectSelectors';

const mapStateToProps = state => ({
  objects: getRelatedObjectsArray(state),
  hasNext: getRelatedObjectsHasNext(state),
});

const mapDispatchToProps = dispatch => ({
  getObjectRelated: () => dispatch(getRelatedWobjects()),
  clearRelateObjects: () => dispatch(clearRelateObjects()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ObjectsRelated);
