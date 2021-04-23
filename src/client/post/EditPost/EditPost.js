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
  uniqWith,
  isEqual,
  isEmpty,
  reduce,
} from 'lodash';
import { getInitialState } from '../../helpers/postHelpers';
import Editor from '../../components/EditorExtended/EditorExtendedComponent';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import PostObjectCard from '../PostObjectCard/PostObjectCard';
import { fromMarkdown, toMarkdown } from '../../components/EditorExtended';
import LastDraftsContainer from '../Write/LastDraftsContainer';
import ObjectCreation from '../../components/Sidebar/ObjectCreation/ObjectCreation';
import {setObjPercents} from '../../helpers/wObjInfluenceHelper';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import CreateObject from '../CreateObjectModal/CreateObject';
import {
  EDITOR_ACTION_ADD,
  getCurrentDraftContent,
  getCurrentDraftId,
  getLastContentAction,
  getLinkedObjects
} from '../../helpers/editorHelper';

import './EditPost.less';

const propTypes = {
  intl: PropTypes.shape().isRequired,
  locale: PropTypes.string.isRequired,
  draftPosts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  draftId: PropTypes.string,
  publishing: PropTypes.bool,
  saving: PropTypes.bool,
  imageLoading: PropTypes.bool,
  createPost: PropTypes.func,
  saveDraft: PropTypes.func,
  buildPost: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  getReviewCheckInfo: PropTypes.func.isRequired,
  getRestoreObjects: PropTypes.func.isRequired,
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
    editor: {
      draftContent,
      content,
      topics,
      linkedObjects = [],
      linkedObjectsCards = [],
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
    props.history.replace({
      pathname: props.location.pathname,
      search: `draft=${getCurrentDraftId(props.draftId, draftIdEditor)}`,
    });
    props.setEditorState(getInitialState(props));
    const campaignId = get(campaign, 'id') || get(props.currDraft, ['jsonMetadata', 'campaignId']);
    const isReview = !isEmpty(campaignId);
    const linkedObjectsCardsSession = JSON.parse(sessionStorage.getItem('linkedObjectsCards')) || [];

    props.setUpdatedEditorData({isReview, linkedObjectsCards: linkedObjectsCardsSession})

    if (isReview) {
      props.getReviewCheckInfo({campaignId, isPublicReview: get(props.currDraft, 'permlink')}, true)
    }
  }, []);

  React.useEffect(() => {
    if (has(props.currDraft, ['jsonMetadata', 'campaignId'])) {
      const postPermlink = get(props.currDraft, 'permlink');
      const campaignId = get(props.currDraft, ['jsonMetadata', 'campaignId']);

      props.getReviewCheckInfo({campaignId, isPublicReview: postPermlink});
      props.getReviewCheckInfo({campaignId, postPermlink});
    }
    sessionStorage.setItem('linkedObjectsCards', JSON.stringify([]));
    setDraftId();
    handleChangeContent(fromMarkdown({title: props.editor.titleValue, body: get(props.currDraft, 'body', '')}), props.editor.titleValue, true);
  }, [props.draftId]);

  React.useEffect(() => {
    props.saveDraft();
  }, [linkedObjects, objPercentage, content, titleValue, topics]);

  const setDraftId = () => {
    if (props.draftId && props.draftId !== draftIdEditor) {
      props.setEditorState(getInitialState(props));
    } else if (props.draftId === null && draftIdEditor) {
      const nextState = getInitialState(props);

      props.setEditorState(nextState)

      props.history.replace({
        pathname: props.location.pathname,
        search: `draft=${nextState.draftId}`,
      });
    }
  };

  const handleChangeContent = useCallback(debounce(
    async (rawContent, title, updateLinkedObjects = false) => {
    let newDraft = {};
    const updatedStore = {content: toMarkdown(rawContent), titleValue: title};
    const getRowContent = Object.values(get(rawContent, 'entityMap', {}));
    const getCurrentRawContent = Object.values(get(currentRawContent, 'entityMap', {}));
    const isChangedObjects = getRowContent.length !== getCurrentRawContent.length;

    if(isChangedObjects || updateLinkedObjects) {
      const rawContentUpdated = await props.getRestoreObjects(rawContent);
      const getRawContentUpdated = Object.values(get(rawContentUpdated, 'entityMap', {}));

      const { actionValue, actionType } = getLastContentAction(getRawContentUpdated, getCurrentRawContent);
      const parsedLinkedObjects = uniqBy(getLinkedObjects(rawContentUpdated), '_id');
      let updatedObjPercentage = setObjPercents(parsedLinkedObjects, objPercentage);

      if (updateLinkedObjects) {
        updatedObjPercentage = reduce(updatedObjPercentage, (acc, value, key) => {
          acc[key] = {percent: 100 / Object.keys(updatedObjPercentage).length};

          return acc;
        }, {});
      }
      if (actionType === EDITOR_ACTION_ADD && linkedObjectsCards.find(object => object.author_permlink === actionValue.data.object.author_permlink)) {
        const filteredObjectCards = linkedObjectsCards.filter(object => object.author_permlink !== actionValue.data.object.author_permlink)

        sessionStorage.setItem('linkedObjectsCards', JSON.stringify(filteredObjectCards));
        updatedStore.linkedObjectsCards = filteredObjectCards;
        updatedObjPercentage = { ...updatedObjPercentage, [actionValue.data.object._id]: {percent: 100 / linkedObjects.length} }
      }
      updatedStore.linkedObjects = parsedLinkedObjects;
      updatedStore.objPercentage = updatedObjPercentage;
      newDraft = getCurrentDraftContent(updatedStore, rawContentUpdated, currentRawContent);
    }
    if (
      content !== updatedStore.content ||
      titleValue !== updatedStore.titleValue ||
      updateLinkedObjects
    ) {
      props.setUpdatedEditorData({ ...updatedStore, ...newDraft });
    }
  }, 1500), [currentRawContent, props.draftId, linkedObjects, objPercentage, linkedObjectsCards]);

  const handleSettingsChange = updatedValue => props.setUpdatedEditorData({ settings: {...settings, ...updatedValue} });

  const handleSubmit = () => {
    const postData = props.buildPost();
    const isReview =
      !isEmpty(campaign) || includes(get(props.history, ['location', 'search']), 'review');

    props.createPost(postData, props.beneficiaries, isReview, campaign, props.intl);
  }
  const handleToggleLinkedObject = (objId, isLinked, uniqId) => {
    const prohibitedObjectCards = linkedObjectsCards || [];
    const currentObj = find(linkedObjects, {_id: uniqId});
    const switchableObjPermlink = currentObj.author_permlink;
    const indexSwitchableHashtag = topics.indexOf(switchableObjPermlink);

    if (!isLinked) {
      topics.splice(indexSwitchableHashtag, 1);
    }
    const updPercentage = {
      ...objPercentage,
      [objId || uniqId]: {percent: isLinked ? 33 : 0}, // 33 - just non zero value
    };

    prohibitedObjectCards.push(currentObj);
    sessionStorage.setItem('linkedObjectsCards', JSON.stringify(prohibitedObjectCards));
    props.setUpdatedEditorData({
      topics,
      linkedObjects,
      linkedObjectsCards: prohibitedObjectCards,
      objPercentage: setObjPercents(linkedObjects, updPercentage),
    });
  }

  const handleObjectSelect = (object) => props.handleObjectSelect(object).then(data => {
    handleChangeContent(fromMarkdown(data), data.title)
  });

  const handleCreateObject = (object) => props.handleObjectSelect(object);

  const handleHashtag = objectName => {
    props.setUpdatedEditorData({ topics: uniqWith([...topics, objectName], isEqual) });
  }

  return (
    <div className="shifted">
      <div className="post-layout container">
        <div className="center">
          <Editor
            enabled={!props.imageLoading}
            initialContent={draftContent}
            locale={props.locale}
            onChange={handleChangeContent}
            intl={props.intl}
            handleHashtag={handleHashtag}
            displayTitle
            draftId={props.draftId}
            linkedObjectsCards={linkedObjectsCards}
          />
          {props.draftPosts.some(d => d.draftId === props.draftId) && (
            <div className="edit-post__saving-badge">
              {props.saving ? (
                <Badge
                  status="error"
                  text={props.intl.formatMessage({id: 'saving', defaultMessage: 'Saving...'})}
                />
              ) : (
                <Badge
                  status="success"
                  text={props.intl.formatMessage({id: 'saved', defaultMessage: 'Saved'})}
                />
              )}
            </div>
          )}
          <PostPreviewModal
            content={content}
            isPublishing={props.publishing}
            isUpdating={isUpdating}
            linkedObjects={linkedObjects}
            objPercentage={objPercentage}
            onUpdate={props.saveDraft}
            reviewData={campaign}
            settings={settings}
            topics={topics}
            onSettingsChange={handleSettingsChange}
            onSubmit={handleSubmit}
            isGuest={props.isGuest}
            titleValue={titleValue}
          />

          <div className="search-object-panel">
            {props.intl.formatMessage({
              id: 'editor_search_elements',
              defaultMessage: 'Attach hashtags, objects, pages, etc.',
            })}
          </div>
          <SearchObjectsAutocomplete
            placeholder={props.intl.formatMessage({
              id: 'editor_search_object_by_name',
              defaultMessage: 'Search by name',
            })}
            handleSelect={handleObjectSelect}
            addHashtag={!props.isWaivio}
          />
          <CreateObject onCreateObject={handleCreateObject}/>
          {props.filteredObjectsCards.map(wObj =>
             <PostObjectCard
                isLinked={get(objPercentage, [wObj._id, 'percent'], 0) > 0}
                wObject={wObj}
                onToggle={handleToggleLinkedObject}
                key={wObj._id}
              />
          )}
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
