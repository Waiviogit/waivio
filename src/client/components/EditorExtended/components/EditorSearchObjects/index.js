import { connect } from 'react-redux';

import EditorSearchObjects from './EditorSearchObjects';
import {
  getSearchCoordinates,
  getSearchString,
  getWordForCountWidth,
} from '../../../../store/editorStore/editorSelectors';
import { selectObjectFromSearch } from '../../../../store/editorStore/editorActions';
import { getSearchObjectsResults } from '../../../../store/searchStore/searchSelectors';

const mapStateToProps = state => ({
  wordForCountWidth: getWordForCountWidth(state),
  searchStringValue: getSearchString(state),
  searchObjectsResults: getSearchObjectsResults(state),
  searchCoordinates: getSearchCoordinates(state),
});

const mapDispatchToProps = dispatch => ({
  selectObjectFromSearch: object => dispatch(selectObjectFromSearch(object)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorSearchObjects);
