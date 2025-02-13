import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getCurrentDraftId } from '../../../common/helpers/editorHelper';
import { getIsWaivio } from '../../../store/appStore/appSelectors';
import { isGuestUser } from '../../../store/authStore/authSelectors';
import {
  getDraftsList,
  safeDraftAction,
  setCurrentDraft,
  resetLinkedObjects,
  setObjPercent,
  toggleLinkedObj,
  setInitialLinkedObj,
} from '../../../store/draftsStore/draftsActions';
import {
  getDraftPostsSelector,
  getCurrDraftSelector,
  getLinkedObjects,
  getObjectPercentageSelector,
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
} from '../../../store/slateEditorStore/editorSelectors';
import requiresLogin from '../../auth/requiresLogin';
import Loading from '../../components/Icon/Loading';
import EditPost from './EditPost';

const EditorContainer = props => {
  const query = new URLSearchParams(props.location.search);
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [draftIdState, setDraftId] = useState(getCurrentDraftId(query.get('draft')));

  useEffect(() => {
    const objects = query.getAll('permlink');

    if (props.draftPosts.length === 0) {
      props.getDraftsListAction().then(data => {
        const currDraft = data?.value?.result.find(d => d.draftId === draftIdState);
        const isCampaign = query.get('campaign') || currDraft?.jsonMetadata?.campaignId;

        if (currDraft) props.setCurrentDraft(currDraft);
        if (isCampaign) {
          getInfoAboutCampaign(currDraft).then(() => {
            setLoading(false);
          });
        } else {
          if (objects.length) props.setInitialLinkedObj(objects);
          setLoading(false);
        }
      });
    } else {
      const currDraft = props.draftPosts.find(d => d.draftId === draftIdState);
      const isCampaign = query.get('campaign') || currDraft?.jsonMetadata?.campaignId;

      if (currDraft) props.setCurrentDraft(currDraft);
      if (!currDraft && objects.length && !isCampaign) props.setInitialLinkedObj(objects);

      if (isCampaign) getInfoAboutCampaign(currDraft);
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
      setCampaign(null);
      setDraftId(newId);

      if (props.currentDraft?.jsonMetadata?.campaignId) getInfoAboutCampaign(props.currentDraft);
      else setLoading(false);
    }
  }, [props.currentDraft]);

  const getInfoAboutCampaign = currDraft => {
    const campaignId = query.get('campaign') || currDraft?.jsonMetadata?.campaignId;
    const isReview = !isEmpty(campaignId);

    if (isReview) {
      const campaignType = props.campaignType || currDraft?.campaignType;
      const secondaryItem = props.secondaryItem || currDraft?.secondaryItem;

      return props
        .getReviewCheckInfo({ campaignId }, props.intl, campaignType, secondaryItem)
        .then(data => {
          setCampaign(data);
          setLoading(false);

          return data;
        })
        .catch(() => {
          setLoading(false);
          setCampaign(null);
        });
    }

    return Promise.resolve();
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <EditPost
          {...props}
          currDraft={props.currentDraft}
          campaign={campaign}
          draftId={draftIdState}
        />
      )}
    </div>
  );
};

EditorContainer.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  draftPosts: PropTypes.arrayOf(
    PropTypes.shape({
      draftId: PropTypes.string.isRequired,
      jsonMetadata: PropTypes.shape({
        campaignId: PropTypes.string,
      }),
      campaignType: PropTypes.string,
      secondaryItem: PropTypes.string,
    }),
  ).isRequired,
  currentDraft: PropTypes.shape({
    jsonMetadata: PropTypes.shape({
      campaignId: PropTypes.string,
    }),
    campaignType: PropTypes.string,
    secondaryItem: PropTypes.string,
  }),
  campaignId: PropTypes.string,
  campaignType: PropTypes.string,
  secondaryItem: PropTypes.string,
  locale: PropTypes.string.isRequired,
  publishing: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  imageLoading: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  beneficiaries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isWaivio: PropTypes.bool.isRequired,
  editor: PropTypes.shape().isRequired,
  filteredObjectsCards: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  objPercentage: PropTypes.shape().isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  setEditorState: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
  saveDraft: PropTypes.func.isRequired,
  getReviewCheckInfo: PropTypes.func.isRequired,
  setUpdatedEditorData: PropTypes.func.isRequired,
  buildPost: PropTypes.func.isRequired,
  handleObjectSelect: PropTypes.func.isRequired,
  leaveEditor: PropTypes.func.isRequired,
  handlePasteText: PropTypes.func.isRequired,
  setLinkedObj: PropTypes.func.isRequired,
  setClearState: PropTypes.func.isRequired,
  getDraftsListAction: PropTypes.func.isRequired,
  setCurrentDraft: PropTypes.func.isRequired,
  setInitialLinkedObj: PropTypes.func.isRequired,
  resetLinkedObjects: PropTypes.func.isRequired,
  setObjPercent: PropTypes.func.isRequired,
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
    filteredObjectsCards: getLinkedObjects(state),
    currentDraft: getCurrDraftSelector(state),
    objPercentage: getObjectPercentageSelector(state),
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const query = new URLSearchParams(props.location.search);
  const draftId = query.get('draft');

  return {
    setEditorState: editorState => dispatch(setEditorState(editorState)),
    createPost: (postData, beneficiaries, isReview, campaign, intl) =>
      dispatch(createPost(postData, beneficiaries, isReview, campaign, intl)),
    saveDraft: data => dispatch(safeDraftAction(draftId, data)),
    getReviewCheckInfo: (data, intl, campaignType, secondaryItem) =>
      dispatch(getCampaignInfo(data, intl, campaignType, secondaryItem)),
    setUpdatedEditorData: data => dispatch(setUpdatedEditorData(data)),
    buildPost: () => dispatch(buildPost(draftId)),
    handleObjectSelect: object => dispatch(handleObjectSelect(object, false, props.intl)),
    leaveEditor: () => dispatch(leaveEditor()),
    handlePasteText: html => dispatch(handlePasteText(html)),
    setLinkedObj: obj => dispatch(setLinkedObj(obj)),
    setClearState: () => dispatch(setClearState()),
    getDraftsListAction: obj => dispatch(getDraftsList(obj)),
    setCurrentDraft: draft => dispatch(setCurrentDraft(draft)),
    setInitialLinkedObj: permlinks => dispatch(setInitialLinkedObj(permlinks)),
    resetLinkedObjects: () => dispatch(resetLinkedObjects()),
    setObjPercent: data => dispatch(setObjPercent(data, draftId)),
    toggleLinkedObj: data => dispatch(toggleLinkedObj(data, draftId)),
  };
};

export default requiresLogin(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(EditorContainer))),
);
