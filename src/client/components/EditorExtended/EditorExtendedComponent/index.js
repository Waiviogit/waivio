import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  getRestoreObjects,
  handleObjectSelect,
  setUpdatedEditorData,
  setUpdatedEditorExtendedData,
} from '../../../store/editorStore/editorActions';
import EditorExtended from './EditorExtended';
import { getEditorExtended } from '../../../store/editorStore/editorSelectors';

const mapStateToProps = state => ({
  editorExtended: getEditorExtended(state),
});

const mapDispatchToProps = (dispatch, props) => ({
  getRestoreObjects: (rawContent, newObject, draftId) =>
    dispatch(getRestoreObjects(rawContent, newObject, draftId)),
  setUpdatedEditorData: data => dispatch(setUpdatedEditorData(data)),
  handleObjectSelect: (object, isFocusEndCursor) => dispatch(handleObjectSelect(object, isFocusEndCursor, props.intl)),
  setUpdatedEditorExtendedData: data => dispatch(setUpdatedEditorExtendedData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditorExtended));
