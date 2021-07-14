import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  getRestoreObjects,
  handleObjectSelect,
  setUpdatedEditorData,
  setShowEditorSearch,
  setCursorCoordinates,
  setUpdatedEditorExtendedData,
} from '../../../../store/editorStore/editorActions';
import EditorExtended from './EditorExtended';
import {
  getEditorExtended,
  getEditorExtendedIsShowSearch,
} from '../../../../store/editorStore/editorSelectors';
import { searchObjectsAutoCompete } from '../../../../store/searchStore/searchActions';
import { getIsWaivio } from '../../../../store/appStore/appSelectors';
import {
  getIsStartSearchObject,
  getSearchObjectsResults,
} from '../../../../store/searchStore/searchSelectors';

const mapStateToProps = state => ({
  isWaivio: getIsWaivio(state),
  editorExtended: getEditorExtended(state),
  isShowEditorSearch: getEditorExtendedIsShowSearch(state),
  searchObjectsResults: getSearchObjectsResults(state),
  isStartSearchObject: getIsStartSearchObject(state),
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
  searchObjects: (value, isWaivio) => dispatch(searchObjectsAutoCompete(value, '', null, isWaivio)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditorExtended));
