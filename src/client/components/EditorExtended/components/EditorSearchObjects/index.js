import { connect } from 'react-redux';

import EditorSearchObjects from './EditorSearchObjects';
import {
  getSearchString,
  getWordForCountWidth,
  getSearchCoordinates,
  getEditorExtendedState,
  getEditorExtendedSelectionState,
} from '../../../../store/editorStore/editorSelectors';
import {
  setEditorExtendedState,
  setShowEditorSearch,
} from '../../../../store/editorStore/editorActions';
import { getIsStartSearchObject, getSearchObjectsResults } from "../../../../store/searchStore/searchSelectors";

const mapStateToProps = state => ({
  wordForCountWidth: getWordForCountWidth(state),
  searchStringValue: getSearchString(state),
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
