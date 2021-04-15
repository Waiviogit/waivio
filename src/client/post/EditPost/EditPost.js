import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {Badge} from 'antd';
import {
  debounce,
  get,
  has,
  uniqBy,
  includes,
  find,
  indexOf,
  uniqWith,
  concat,
  isEqual,
  isEmpty,
} from 'lodash';
import { getInitialState } from '../../helpers/postHelpers';
import Editor from '../../components/EditorExtended/EditorExtended';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import PostObjectCard from '../PostObjectCard/PostObjectCard';
import {toMarkdown} from '../../components/EditorExtended';
import LastDraftsContainer from '../Write/LastDraftsContainer';
import ObjectCreation from '../../components/Sidebar/ObjectCreation/ObjectCreation';
import {setObjPercents} from '../../helpers/wObjInfluenceHelper';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import CreateObject from '../CreateObjectModal/CreateObject';
import { getCurrentDraftContent, getCurrentDraftId, getLinkedObjects } from '../../helpers/editorHelper';

import './EditPost.less';

const propTypes = {
  intl: PropTypes.shape().isRequired,
  locale: PropTypes.string.isRequired,
  draftPosts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  campaignId: PropTypes.string, // eslint-disable-line
  draftId: PropTypes.string,
  publishing: PropTypes.bool,
  saving: PropTypes.bool,
  imageLoading: PropTypes.bool,
  createPost: PropTypes.func,
  saveDraft: PropTypes.func,
  buildPost: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  getReviewCheckInfo: PropTypes.func.isRequired,
  setUpdatedEditorData: PropTypes.func.isRequired,
  handleObjectSelect: PropTypes.func.isRequired,
  isWaivio: PropTypes.bool,
  isGuest: PropTypes.bool,
  beneficiaries: PropTypes.arrayOf(PropTypes.shape()),
  history: PropTypes.shape().isRequired,
  editor: PropTypes.shape().isRequired,
  currDraft: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  filteredObjectsCards: PropTypes.array.isRequired,
};

const defaultProps = {
  upvoteSetting: false,
  campaignId: '',
  draftId: '',
  publishing: false,
  saving: false,
  isWaivio: true,
  imageLoading: false,
  createPost: () => {
  },
  saveDraft: () => {
  },
  isGuest: false,
  beneficiaries: [],
};

const EditPost = (props) => {
  const {
    history,
    saving,
    publishing,
    imageLoading,
    intl,
    locale,
    draftPosts,
    isGuest,
    setEditorState,
    setUpdatedEditorData,
    currDraft,
    getReviewCheckInfo,
    beneficiaries,
    createPost,
    isWaivio,
    location,
    draftId,
    buildPost,
    saveDraft,
    filteredObjectsCards,
    handleObjectSelect,
    editor: {
      draftContent,
      content,
      topics,
      linkedObjects,
      linkedObjectsCards,
      objPercentage,
      settings,
      campaign,
      isUpdating,
      titleValue,
      currentRawContent,
      draftIdEditor,
    },
  } = props;

  React.useEffect(() => {
    history.replace({
      pathname: location.pathname,
      search: `draft=${getCurrentDraftId(draftId, draftIdEditor)}`,
    });
    setEditorState(getInitialState(props));
    const campaignId = get(campaign, 'id') || get(currDraft, ['jsonMetadata', 'campaignId']);
    const isReview = !isEmpty(campaignId);
    const linkedObjectsCardsSession = JSON.parse(sessionStorage.getItem('linkedObjectsCards')) || [];

    setUpdatedEditorData({isReview, linkedObjectsCards: linkedObjectsCardsSession})

    if (isReview) {
      getReviewCheckInfo({campaignId, isPublicReview: get(currDraft, 'permlink')}, true)
    }
  }, []);

  React.useEffect(() => {
    if (has(currDraft, ['jsonMetadata', 'campaignId'])) {
      const postPermlink = get(currDraft, 'permlink');
      const campaignId = get(currDraft, ['jsonMetadata', 'campaignId']);

      getReviewCheckInfo({campaignId, isPublicReview: postPermlink});
      getReviewCheckInfo({campaignId, postPermlink});
    }
    setDraftId();
  }, [draftId]);

  React.useEffect(() => {
    saveDraft();
  },
    [linkedObjects, objPercentage, content, titleValue, topics]);

  const setDraftId = () => {
    if (draftId && draftId !== draftIdEditor) {
      setEditorState(getInitialState(props));
    } else if (draftId === null && draftIdEditor) {
      const nextState = getInitialState(props);

      setEditorState(nextState)

      history.replace({
        pathname: location.pathname,
        search: `draft=${nextState.draftId}`,
      });
    }
  };

  const handleChangeContent = useCallback(debounce(
    (rawContent, title) => {
    const updatedStore = {content: toMarkdown(rawContent), titleValue: title};

    const updatedLinkedObjects = uniqBy(concat(linkedObjects, getLinkedObjects(rawContent)), '_id');

    const isLinkedObjectsChanged = (linkedObjects && updatedLinkedObjects) && linkedObjects.length !== updatedLinkedObjects.length;

    if (isLinkedObjectsChanged) {
      const updatedObjPercentage = setObjPercents(linkedObjects, objPercentage);

      sessionStorage.setItem('linkedObjects', JSON.stringify(linkedObjects || []));
      updatedStore.linkedObjects = updatedLinkedObjects;
      updatedStore.objPercentage = updatedObjPercentage;
    }
    if (
      content !== updatedStore.content ||
      isLinkedObjectsChanged ||
      titleValue !== updatedStore.titleValue
    ) {
      const newDraft = getCurrentDraftContent(updatedStore, rawContent, currentRawContent);

      setUpdatedEditorData({...updatedStore, ...newDraft});
    }
  }, 1500), [currentRawContent, draftId, linkedObjects, linkedObjectsCards, objPercentage]);

  const handleSettingsChange = updatedValue => setUpdatedEditorData({
      settings: {...settings, ...updatedValue}
    });

  const handleSubmit = () => {
    const postData = buildPost();
    const isReview =
      !isEmpty(campaign) || includes(get(history, ['location', 'search']), 'review');

    createPost(postData, beneficiaries, isReview, campaign, intl);
  }
  const handleToggleLinkedObject = (objId, isLinked, uniqId) => {
    const prohibitedObjectCards = linkedObjectsCards || [];
    const currentObj = find(linkedObjects, {_id: uniqId});
    const switchableObj = indexOf(linkedObjects, currentObj);
    const switchableObjPermlink = currentObj.author_permlink;
    const indexSwitchableHashtag = topics.indexOf(switchableObjPermlink);

    if (!isLinked) {
      linkedObjects.splice(switchableObj, 1);
      topics.splice(indexSwitchableHashtag, 1);
    }
    const updPercentage = {
      ...objPercentage,
      [objId || uniqId]: {percent: isLinked ? 33 : 0}, // 33 - just non zero value
    };

    prohibitedObjectCards.push(currentObj);
    sessionStorage.setItem('linkedObjectsCards', JSON.stringify(prohibitedObjectCards));
    setUpdatedEditorData({
      topics,
      linkedObjectsCards: prohibitedObjectCards,
      objPercentage: setObjPercents(linkedObjects, updPercentage),
    });
  }

  const handleCreateObject = (object) => {
    setTimeout(() => handleObjectSelect(object), 1200);
  }

  const handleHashtag = objectName => {
    setUpdatedEditorData({ topics: uniqWith([...topics, objectName], isEqual) });
  }
  const handleLinkedObjectsCards = updatedLinkedObjectsCards => setUpdatedEditorData({
    linkedObjectsCards: updatedLinkedObjectsCards
  });

  return (
    <div className="shifted">
      <div className="post-layout container">
        <div className="center">
          <Editor
            enabled={!imageLoading}
            initialContent={draftContent}
            locale={locale}
            onChange={handleChangeContent}
            intl={intl}
            handleHashtag={handleHashtag}
            displayTitle
            draftId={draftId}
            linkedObjectsCards={linkedObjectsCards}
            handleLinkedObjectsCards={handleLinkedObjectsCards}
          />
          {draftPosts.some(d => d.draftId === draftId) && (
            <div className="edit-post__saving-badge">
              {saving ? (
                <Badge
                  status="error"
                  text={intl.formatMessage({id: 'saving', defaultMessage: 'Saving...'})}
                />
              ) : (
                <Badge
                  status="success"
                  text={intl.formatMessage({id: 'saved', defaultMessage: 'Saved'})}
                />
              )}
            </div>
          )}
          <PostPreviewModal
            content={content}
            isPublishing={publishing}
            isUpdating={isUpdating}
            linkedObjects={linkedObjects}
            objPercentage={objPercentage}
            onUpdate={saveDraft}
            reviewData={campaign}
            settings={settings}
            topics={topics}
            onSettingsChange={handleSettingsChange}
            onSubmit={handleSubmit}
            isGuest={isGuest}
            titleValue={titleValue}
          />

          <div className="search-object-panel">
            {intl.formatMessage({
              id: 'editor_search_elements',
              defaultMessage: 'Attach hashtags, objects, pages, etc.',
            })}
          </div>
          <SearchObjectsAutocomplete
            placeholder={intl.formatMessage({
              id: 'editor_search_object_by_name',
              defaultMessage: 'Search by name',
            })}
            handleSelect={handleObjectSelect}
            addHashtag={!isWaivio}
          />
          <CreateObject onCreateObject={handleCreateObject}/>
          {filteredObjectsCards.map(wObj => (
            <PostObjectCard
              isLinked={get(objPercentage, [wObj.id, 'percent'], 0) > 0}
              wObject={wObj}
              onToggle={handleToggleLinkedObject}
              key={wObj.id}
            />
          ))}
        </div>
        <div className="rightContainer">
          <div className="right">
            <ObjectCreation/>
            <LastDraftsContainer/>
          </div>
        </div>
      </div>
    </div>
  );
}

EditPost.propTypes = propTypes;
EditPost.defaultProps = defaultProps;

export default EditPost;
