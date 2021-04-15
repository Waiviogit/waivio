import { connect } from "react-redux";
import { withRouter } from "react-router";
import EditPost from "./EditPost";
import requiresLogin from '../../auth/requiresLogin';
import { getAuthenticatedUser, isGuestUser } from "../../store/authStore/authSelectors";
import { getSuitableLanguage } from "../../store/reducers";
import {
  getEditor,
  getDraftPosts,
  getIsEditorLoading,
  getIsEditorSaving,
  getIsImageUploading, getCurrentDraft, getFilteredObjectCards
} from "../../store/editorStore/editorSelectors";
import { getUpvoteSetting } from "../../store/settingsStore/settingsSelectors";
import { getBeneficiariesUsers } from "../../store/searchStore/searchSelectors";
import { getCurrentHost, getIsWaivio } from "../../store/appStore/appSelectors";
import {
  createPost,
  saveDraft,
  setEditorState,
  reviewCheckInfo,
  setUpdatedEditorData
} from '../../store/editorStore/editorActions';


const mapStateToProps = (state, props) => {
  const draftId = new URLSearchParams(props.location.search).get('draft');

  return {
    draftId,
    user: getAuthenticatedUser(state),
    locale: getSuitableLanguage(state),
    draftPosts: getDraftPosts(state),
    publishing: getIsEditorLoading(state),
    saving: getIsEditorSaving(state),
    imageLoading: getIsImageUploading(state),
    campaignId: new URLSearchParams(props.location.search).get('campaign'),
    upvoteSetting: getUpvoteSetting(state),
    isGuest: isGuestUser(state),
    beneficiaries: getBeneficiariesUsers(state),
    host: getCurrentHost(state),
    isWaivio: getIsWaivio(state),
    editor: getEditor(state),
    currDraft: getCurrentDraft(state, { draftId }),
    filteredObjectsCards: getFilteredObjectCards(state),
  };
}

const mapDispatchToProps = dispatch => ({
  setEditorState: (props) => dispatch(setEditorState(props)),
  createPost: (postData, beneficiaries, isReview, campaign, intl) =>
    dispatch(createPost(postData, beneficiaries, isReview, campaign, intl)),
  saveDraft: (draft, redirect, intl) =>
    dispatch(saveDraft(draft, redirect, intl)),
  getReviewCheckInfo: (data, needReviewTitle) => dispatch(reviewCheckInfo(data, needReviewTitle)),
  setUpdatedEditorData: (data) => dispatch(setUpdatedEditorData(data)),
});

export default requiresLogin(withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPost)));
