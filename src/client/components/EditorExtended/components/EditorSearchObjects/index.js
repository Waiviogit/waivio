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
  selectObjectFromSearch,
  setEditorExtendedState,
} from '../../../../store/editorStore/editorActions';
import { getSearchObjectsResults } from '../../../../store/searchStore/searchSelectors';

const mapStateToProps = state => ({
  wordForCountWidth: getWordForCountWidth(state),
  searchStringValue: getSearchString(state),
  searchCoordinates: getSearchCoordinates(state),
  editorState: getEditorExtendedState(state),
  oldSelectionState: getEditorExtendedSelectionState(state),
  searchObjectsResults: getSearchObjectsResults(state),
});

const mapDispatchToProps = dispatch => ({
  setEditorExtendedState: editorState => dispatch(setEditorExtendedState(editorState)),
  selectObjectFromSearch: object => dispatch(selectObjectFromSearch(object)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorSearchObjects);
