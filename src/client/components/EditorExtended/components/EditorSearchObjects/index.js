import { connect } from 'react-redux';

import EditorSearchObjects from './EditorSearchObjects';
import {
  getEditorExtendedSelectionState,
  getEditorExtendedState,
  getSearchCoordinates,
} from '../../../../store/editorStore/editorSelectors';
import {
  setEditorExtendedState,
  setShowEditorSearch,
} from '../../../../store/editorStore/editorActions';
import { getIsStartSearchObject, getSearchObjectsResults } from "../../../../store/searchStore/searchSelectors";

const mapStateToProps = state => ({
  searchCoordinates: getSearchCoordinates(state),
  editorState: getEditorExtendedState(state),
  oldSelectionState: getEditorExtendedSelectionState(state),
  searchObjectsResults: getSearchObjectsResults(state),
  isStartSearchObj: getIsStartSearchObject(state),
});

const mapDispatchToProps = dispatch => ({
  closeSearchInput: () => dispatch(setShowEditorSearch(false)),
  setEditorExtendedState: editorState => dispatch(setEditorExtendedState(editorState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorSearchObjects);
