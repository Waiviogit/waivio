import { connect } from 'react-redux';

import EditorSearchAutoComplete from './EditorSearchAutoComplete';
import { searchObjectsAutoCompete } from '../../../../../store/searchStore/searchActions';
import { getIsWaivio } from '../../../../../store/appStore/appSelectors';
import {
  getIsStartSearchObject,
  getSearchObjectsResults,
} from '../../../../../store/searchStore/searchSelectors';
import { selectObjectEditorSearch } from '../../../../../store/editorStore/editorActions';

const mapStateToProps = state => ({
  isWaivio: getIsWaivio(state),
  isSearchObject: getIsStartSearchObject(state),
  searchObjectsResults: getSearchObjectsResults(state),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { isWaivio } = stateProps;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    selectObjectSearch: object => dispatch(selectObjectEditorSearch(object)),
    searchObjects: value => dispatch(searchObjectsAutoCompete(value, '', null, isWaivio)),
  };
};

export default connect(mapStateToProps, null, mergeProps)(EditorSearchAutoComplete);
