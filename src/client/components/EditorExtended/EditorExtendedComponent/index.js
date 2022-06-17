import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  getRestoreObjects,
  handleObjectSelect,
  setUpdatedEditorData,
  setShowEditorSearch,
  setCursorCoordinates,
  setUpdatedEditorExtendedData,
} from '../../../../store/slateEditorStore/editorActions';
import EditorExtended from './EditorExtended';
import {
  getEditorExtended,
  getEditorExtendedIsShowSearch,
} from '../../../../store/editorStore/editorSelectors';
import { searchObjectsAutoCompete } from '../../../../store/searchStore/searchActions';

const mapStateToProps = state => ({
  editorExtended: getEditorExtended(state),
  isShowEditorSearch: getEditorExtendedIsShowSearch(state),
});

const mapDispatchToProps = (dispatch, props) => ({
  getRestoreObjects: (rawContent, newObject, draftId) =>
    dispatch(getRestoreObjects(rawContent, newObject, draftId)),
  setUpdatedEditorData: data => dispatch(setUpdatedEditorData(data)),
  handleObjectSelect: (object, isFocusEndCursor) =>
    dispatch(handleObjectSelect(object, isFocusEndCursor, props.intl)),
  setUpdatedEditorExtendedData: data => dispatch(setUpdatedEditorExtendedData(data)),
  setShowEditorSearch: data => dispatch(setShowEditorSearch(data)),
  setCursorCoordinates: data => dispatch(setCursorCoordinates(data)),
  searchObjects: value => dispatch(searchObjectsAutoCompete(value, '', null, true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditorExtended));
