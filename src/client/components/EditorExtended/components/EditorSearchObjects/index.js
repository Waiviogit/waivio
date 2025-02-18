import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router';

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
import {
  getSearchObjectsResults,
  getIsStartSearchObject,
} from '../../../../../store/searchStore/searchSelectors';

const mapStateToProps = state => ({
  wordForCountWidth: getWordForCountWidth(state),
  searchStringValue: getSearchString(state),
  searchObjectsResults: getSearchObjectsResults(state),
  searchCoordinates: getSearchCoordinates(state),
  isLoading: getIsStartSearchObject(state),
});

const mapDispatchToProps = dispatch => {
  const match = useRouteMatch();

  return {
    selectObjectFromSearch: (object, editor) =>
      dispatch(selectObjectFromSearch(object, editor, match)),
    clearEditorSearchObjects: () => dispatch(clearEditorSearchObjects()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorSearchObjects);
