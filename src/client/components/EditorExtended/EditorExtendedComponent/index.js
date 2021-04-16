import { connect } from "react-redux";

import {
  getObjectIds,
  getRawContentEntityMap,
  getRestoreObjects,
  setUpdatedEditorData
} from "../../../store/editorStore/editorActions";
import EditorExtended from "./EditorExtended";

const mapDispatchToProps = (dispatch) => ({
  setUpdatedEditorData: (data) => dispatch(setUpdatedEditorData(data)),
  getObjectIds: (rawContent, newObject, draftId) => dispatch(getObjectIds(rawContent, newObject, draftId)),
  getRawContentEntityMap: (rawContent, response) => dispatch(getRawContentEntityMap(rawContent, response)),
  getRestoreObjects: (rawContent, newObject, draftId) => dispatch(getRestoreObjects(rawContent, newObject, draftId)),
});

export default connect(null, mapDispatchToProps)(EditorExtended);
