import { isEmpty } from 'lodash';
import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch, connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getCurrentDraftId } from '../../../common/helpers/editorHelper';
import { getIsWaivio } from '../../../store/appStore/appSelectors';
import { isGuestUser } from '../../../store/authStore/authSelectors';
import {
  getDraftsList,
  safeDraftAction,
  setCurrentDraft,
} from '../../../store/draftsStore/draftsActions';
import {
  getDraftPostsSelector,
  getCurrDraftSelector,
} from '../../../store/draftsStore/draftsSelectors';
import { getSuitableLanguage } from '../../../store/reducers';
import { getBeneficiariesUsers } from '../../../store/searchStore/searchSelectors';
import {
  setEditorState,
  createPost,
  getCampaignInfo,
  setUpdatedEditorData,
  buildPost,
  handleObjectSelect,
  setClearState,
  leaveEditor,
  handlePasteText,
  setLinkedObj,
} from '../../../store/slateEditorStore/editorActions';
import {
  getIsEditorLoading,
  getIsEditorSaving,
  getIsImageUploading,
  getEditor,
  getFilteredObjectCards,
} from '../../../store/slateEditorStore/editorSelectors';
import { getCoordinates } from '../../../store/userStore/userActions';
import requiresLogin from '../../auth/requiresLogin';
import Loading from '../../components/Icon/Loading';
import EditPost from './EditPost';

const EditorContainer = props => {
  const query = new URLSearchParams(props.location.search);
  const [loading, setLoading] = useState(true);
  const [campaing, setCampaing] = useState(null);
  const [draftIdState, setDraftId] = useState(getCurrentDraftId(query.get('draft')));

  useEffect(() => {
    if (props.draftPosts.length === 0) {
      props.getDraftsListAction().then(data => {
        const currDraft = data?.value?.result.find(d => d.draftId === draftIdState);

        props.setCurrentDraft(currDraft);

        if (query.get('campaign') || currDraft?.jsonMetadata?.campaignId) {
          getInfoAboutCampaign(currDraft).then(() => {
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    } else {
      const currDraft = props.draftPosts.find(d => d.draftId === draftIdState);

      props.setCurrentDraft(currDraft);

      if (query.get('campaign') || currDraft?.jsonMetadata?.campaignId)
        getInfoAboutCampaign(currDraft);
      else setLoading(false);
    }

    return () => {
      props.setClearState();
      props.setCurrentDraft(null);
    };
  }, []);

  useEffect(() => {
    const newId = query.get('draft');

    if (newId && draftIdState !== newId) {
      setLoading(true);
      setCampaing(null);
      setDraftId(newId);

      if (props.currentDraft?.jsonMetadata?.campaignId) getInfoAboutCampaign(props.currentDraft);
      else setLoading(false);
    }
  }, [query.get('draft')]);

  const getInfoAboutCampaign = currDraft => {
    const campaignId = query.get('campaign') || currDraft?.jsonMetadata?.campaignId;
    const isReview = !isEmpty(campaignId);

    if (isReview) {
      const campaignType = props.campaignType || currDraft?.campaignType;
      const secondaryItem = props.secondaryItem || currDraft?.secondaryItem;

      return props
        .getReviewCheckInfo({ campaignId }, props.intl, campaignType, secondaryItem)
        .then(data => {
          setCampaing(data);
          setLoading(false);

          return data;
        });
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <EditPost
          {...props}
          currDraft={props.currentDraft}
          campaing={campaing}
          draftId={draftIdState}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const query = new URLSearchParams(props.location.search);

  return {
    campaignId: query.get('campaign'),
    campaignType: query.get('type'),
    secondaryItem: query.get('secondaryItem'),
    locale: getSuitableLanguage(state),
    draftPosts: getDraftPostsSelector(state),
    publishing: getIsEditorLoading(state),
    saving: getIsEditorSaving(state),
    imageLoading: getIsImageUploading(state),
    isGuest: isGuestUser(state),
    beneficiaries: getBeneficiariesUsers(state),
    isWaivio: getIsWaivio(state),
    editor: getEditor(state),
    filteredObjectsCards: getFilteredObjectCards(state),
    currentDraft: getCurrDraftSelector(state),
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const query = new URLSearchParams(props.location.search);
  const draftId = query.get('draft');

  return {
    setEditorState: editorState => dispatch(setEditorState(editorState)),
    createPost: (postData, beneficiaries, isReview, campaign, intl) =>
      dispatch(createPost(postData, beneficiaries, isReview, campaign, intl)),
    saveDraft: data => dispatch(safeDraftAction(draftId, props.intl, data)),
    getReviewCheckInfo: (data, intl, campaignType, secondaryItem) =>
      dispatch(getCampaignInfo(data, intl, campaignType, secondaryItem)),
    setUpdatedEditorData: data => dispatch(setUpdatedEditorData(data)),
    buildPost: () => dispatch(buildPost(draftId)),
    handleObjectSelect: object => dispatch(handleObjectSelect(object, false, props.intl)),
    leaveEditor: () => dispatch(leaveEditor()),
    getCoordinates: () => dispatch(getCoordinates()),
    handlePasteText: html => dispatch(handlePasteText(html)),
    setLinkedObj: obj => dispatch(setLinkedObj(obj)),
    setClearState: () => dispatch(setClearState()),
    getDraftsListAction: obj => dispatch(getDraftsList(obj)),
    setCurrentDraft: draft => dispatch(setCurrentDraft(draft)),
  };
};

export default requiresLogin(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(EditorContainer))),
);
