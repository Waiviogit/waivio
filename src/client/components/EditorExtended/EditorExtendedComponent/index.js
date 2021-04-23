import { connect } from 'react-redux';

import {
  getObjectIds,
  getRestoreObjects,
  getRawContentEntityMap,
  setUpdatedEditorExtendedData,
} from '../../../store/editorStore/editorActions';
import EditorExtended from './EditorExtended';
import { getEditorExtended } from '../../../store/editorStore/editorSelectors';

const mapStateToProps = state => ({
  editorExtended: getEditorExtended(state),
});

const mapDispatchToProps = dispatch => ({
  getObjectIds: (rawContent, newObject, draftId) =>
    dispatch(getObjectIds(rawContent, newObject, draftId)),
  getRestoreObjects: (rawContent, newObject, draftId) =>
    dispatch(getRestoreObjects(rawContent, newObject, draftId)),
  getRawContentEntityMap: (rawContent, response) =>
    dispatch(getRawContentEntityMap(rawContent, response)),
  setUpdatedEditorExtendedData: data => dispatch(setUpdatedEditorExtendedData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorExtended);
