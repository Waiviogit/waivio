import { connect } from 'react-redux';

import {
  getRestoreObjects,
  setUpdatedEditorExtendedData,
} from '../../../store/editorStore/editorActions';
import EditorExtended from './EditorExtended';
import { getEditorExtended } from '../../../store/editorStore/editorSelectors';

const mapStateToProps = state => ({
  editorExtended: getEditorExtended(state),
});

const mapDispatchToProps = dispatch => ({
  getRestoreObjects: (rawContent, newObject, draftId) =>
    dispatch(getRestoreObjects(rawContent, newObject, draftId)),
  setUpdatedEditorExtendedData: data => dispatch(setUpdatedEditorExtendedData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorExtended);
