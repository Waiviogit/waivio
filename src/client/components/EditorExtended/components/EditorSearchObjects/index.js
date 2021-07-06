import { connect } from 'react-redux';

import EditorSearchObjects from './EditorSearchObjects';
import {
  getEditorExtendedSelectionState,
  getEditorExtendedState,
  getSearchCoordinates,
} from '../../../../store/editorStore/editorSelectors';

const mapStateToProps = state => ({
  searchCoordinates: getSearchCoordinates(state),
  editorState: getEditorExtendedState(state),
  oldSelectionState: getEditorExtendedSelectionState(state),
});

export default connect(mapStateToProps)(EditorSearchObjects);
