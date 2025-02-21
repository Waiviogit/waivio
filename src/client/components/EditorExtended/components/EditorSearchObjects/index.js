import { connect } from 'react-redux';
import EditorSearchObjects from './EditorSearchObjects';
import {
  getSearchCoordinates,
  getSearchString,
  getWordForCountWidth,
} from '../../../../../store/slateEditorStore/editorSelectors';
import {
  clearEditorSearchObjects,
  selectObjectFromSearch,
} from '../../../../../store/slateEditorStore/editorActions';
import { getSearchObjectsResults } from '../../../../../store/searchStore/searchSelectors';

const mapStateToProps = state => ({
  wordForCountWidth: getWordForCountWidth(state),
  searchStringValue: getSearchString(state),
  searchObjectsResults: getSearchObjectsResults(state),
  searchCoordinates: getSearchCoordinates(state),
});

const mapDispatchToProps = (dispatch, props) => ({
  selectObjectFromSearch: (object, editor) =>
    dispatch(selectObjectFromSearch(object, editor, props.match)),
  clearEditorSearchObjects: () => dispatch(clearEditorSearchObjects()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorSearchObjects);
