import { connect } from 'react-redux';

import {
  getRestoreObjects,
  setUpdatedEditorData,
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
  setUpdatedEditorData: data => dispatch(setUpdatedEditorData(data)),
  setUpdatedEditorExtendedData: data => dispatch(setUpdatedEditorExtendedData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorExtended);
