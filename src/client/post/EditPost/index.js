import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import EditPost from './EditPost';
import requiresLogin from '../../auth/requiresLogin';
import { isGuestUser } from '../../../store/authStore/authSelectors';
import { getSuitableLanguage } from '../../../store/reducers';
import {
  getEditor,
  getDraftPosts,
  getCurrentDraft,
  getIsEditorSaving,
  getIsEditorLoading,
  getIsImageUploading,
  getFilteredObjectCards,
} from '../../../store/slateEditorStore/editorSelectors';
import { getBeneficiariesUsers } from '../../../store/searchStore/searchSelectors';
import { getIsWaivio } from '../../../store/appStore/appSelectors';
import {
  buildPost,
  saveDraft,
  createPost,
  leaveEditor,
  setClearState,
  setEditorState,
  reviewCheckInfo,
  handlePasteText,
  handleObjectSelect,
  setUpdatedEditorData,
  firstParseLinkedObjects,
  getCampaignInfo,
} from '../../../store/slateEditorStore/editorActions';

const mapStateToProps = (state, props) => {
  const query = new URLSearchParams(props.location.search);

  return {
    draftId: query.get('draft'),
    campaignId: query.get('campaign'),
    locale: getSuitableLanguage(state),
    draftPosts: getDraftPosts(state),
    publishing: getIsEditorLoading(state),
    saving: getIsEditorSaving(state),
    imageLoading: getIsImageUploading(state),
    isGuest: isGuestUser(state),
    beneficiaries: getBeneficiariesUsers(state),
    isWaivio: getIsWaivio(state),
    editor: getEditor(state),
    currDraft: getCurrentDraft(state, { draftId: query.get('draft') }),
    filteredObjectsCards: getFilteredObjectCards(state),
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const query = new URLSearchParams(props.location.search);
  const draftId = query.get('draft');
  const newCampaing = query.get('newCampaing');

  return {
    setEditorState: editorState => dispatch(setEditorState(editorState)),
    firstParseLinkedObjects: draft => dispatch(firstParseLinkedObjects(draft)),
    createPost: (postData, beneficiaries, isReview, campaign, intl) =>
      dispatch(createPost(postData, beneficiaries, isReview, campaign, intl)),
    saveDraft: data => dispatch(saveDraft(draftId, props.intl, data)),
    getReviewCheckInfo: (data, needReviewTitle, intl) =>
      newCampaing
        ? dispatch(getCampaignInfo(data, needReviewTitle, intl))
        : dispatch(reviewCheckInfo(data, needReviewTitle, intl)),
    setUpdatedEditorData: data => dispatch(setUpdatedEditorData(data)),
    buildPost: () => dispatch(buildPost(draftId)),
    handleObjectSelect: object => dispatch(handleObjectSelect(object, false, props.intl)),
    setClearState: () => dispatch(setClearState()),
    leaveEditor: () => dispatch(leaveEditor()),
    handlePasteText: html => dispatch(handlePasteText(html)),
  };
};

export default requiresLogin(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(EditPost))),
);
