import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'antd';
import {
  debounce,
  get,
  has,
  includes,
  find,
  uniqWith,
  isEqual,
  isEmpty,
  isNull,
} from 'lodash';
import { getInitialState } from '../../helpers/postHelpers';
import Editor from '../../components/EditorExtended/EditorExtendedComponent';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import PostObjectCard from '../PostObjectCard/PostObjectCard';
import { fromMarkdown, toMarkdown } from '../../components/EditorExtended';
import LastDraftsContainer from '../Write/LastDraftsContainer';
import ObjectCreation from '../../components/Sidebar/ObjectCreation/ObjectCreation';
import { setObjPercents } from '../../helpers/wObjInfluenceHelper';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import CreateObject from '../CreateObjectModal/CreateObject';
import {
  getCurrentDraftId,
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
  setUpdatedEditorData: PropTypes.func.isRequired,
  handleObjectSelect: PropTypes.func.isRequired,
  isWaivio: PropTypes.bool,
  isGuest: PropTypes.bool,
  beneficiaries: PropTypes.arrayOf(PropTypes.shape()),
  history: PropTypes.shape().isRequired,
  editor: PropTypes.shape().isRequired,
  currDraft: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  filteredObjectsCards: PropTypes.arrayOf().isRequired,
};

const defaultProps = {
  draftId: '',
  publishing: false,
  saving: false,
  isWaivio: true,
  imageLoading: false,
  createPost: () => {},
  saveDraft: () => {},
  isGuest: false,
  beneficiaries: [],
};

const EditPost = props => {
  const {
    editor: {
      draftContent,
      content,
      topics,
      linkedObjects = [],
      hideLinkedObjects = [],
      objPercentage,
      settings,
      campaign,
      isUpdating,
      titleValue,
      currentRawContent,
      draftId: draftIdEditor,
    },
    intl,
  } = props;

  React.useEffect(() => {
    props.history.replace({
      pathname: props.location.pathname,
      search: `draft=${getCurrentDraftId(props.draftId, draftIdEditor)}`,
    });
    props.setEditorState(getInitialState(props));
    const campaignId = get(campaign, 'id') || get(props.currDraft, ['jsonMetadata', 'campaignId']);
    const isReview = !isEmpty(campaignId);
    const hideLinkedObjectsSession = JSON.parse(sessionStorage.getItem('hideLinkedObjects')) || [];

    props.setUpdatedEditorData({ isReview, hideLinkedObjects: hideLinkedObjectsSession });

    if (isReview) {
      props.getReviewCheckInfo(
        { campaignId, isPublicReview: get(props.currDraft, 'permlink') },
        true,
        intl,
      );
    }

    return () => sessionStorage.setItem('hideLinkedObjects', JSON.stringify([]));
  }, []);

  React.useEffect(() => {
    if (has(props.currDraft, ['jsonMetadata', 'campaignId'])) {
      const postPermlink = get(props.currDraft, 'permlink');
      const campaignId = get(props.currDraft, ['jsonMetadata', 'campaignId']);

      props.getReviewCheckInfo({ campaignId, isPublicReview: postPermlink, intl });
      props.getReviewCheckInfo({ campaignId, postPermlink, intl });
    }
    sessionStorage.setItem('hideLinkedObjects', JSON.stringify([]));
    setDraftId();
    handleChangeContent(
      fromMarkdown({
        title: get(props.currDraft, 'title', ''),
        body: get(props.currDraft, 'body', ''),
      }),
      get(props.currDraft, 'title', ''),
      true,
    );
  }, [props.draftId]);

  const setDraftId = () => {
    if (props.draftId && props.draftId !== draftIdEditor) {
      props.setEditorState(getInitialState(props));
    } else if (isNull(props.draftId) && draftIdEditor) {
      const nextState = getInitialState(props);

      props.setEditorState(nextState);

      props.history.replace({
        pathname: props.location.pathname,
        search: `draft=${nextState.draftId}`,
      });
    }
  };

  const handleChangeContent = useCallback(
    debounce(async (rawContent, title, updateLinkedObjects = false) => {
      const updatedStore = { content: toMarkdown(rawContent), titleValue: title };

      if (
        content !== updatedStore.content ||
        titleValue !== updatedStore.titleValue ||
        updateLinkedObjects
      ) {

        props.saveDraft(updatedStore);
        props.setUpdatedEditorData(updatedStore);
      }
    }, 1500),
    [currentRawContent, props.draftId, linkedObjects, objPercentage, hideLinkedObjects],
  );

  const handleSettingsChange = updatedValue =>
    props.setUpdatedEditorData({ settings: { ...settings, ...updatedValue } });

  const handleSubmit = () => {
    const postData = props.buildPost();
    const isReview =
      !isEmpty(campaign) || includes(get(props.history, ['location', 'search']), 'review');

    props.createPost(postData, props.beneficiaries, isReview, campaign, props.intl);
  };
  const handleToggleLinkedObject = (objId, isLinked, uniqId) => {
    const prohibitedObjectCards = hideLinkedObjects || [];
    const currentObj = find(linkedObjects, { _id: uniqId });
    const switchableObjPermlink = currentObj.author_permlink;
    const indexSwitchableHashtag = topics.indexOf(switchableObjPermlink);

    if (!isLinked) {
      topics.splice(indexSwitchableHashtag, 1);
    }
    const updPercentage = {
      ...objPercentage,
      [objId || uniqId]: { percent: isLinked ? 33 : 0 }, // 33 - just non zero value
    };

    prohibitedObjectCards.push(currentObj);
    sessionStorage.setItem('hideLinkedObjects', JSON.stringify(prohibitedObjectCards));
    props.setUpdatedEditorData({
      topics,
      linkedObjects: linkedObjects.filter(object => object._id !== uniqId),
      hideLinkedObjects: prohibitedObjectCards,
      objPercentage: setObjPercents(linkedObjects, updPercentage),
    });
  };

  const handleObjectSelect = object => props.handleObjectSelect(object);

  const handleCreateObject = object => props.handleObjectSelect(object);

  const handleHashtag = objectName => {
    props.setUpdatedEditorData({ topics: uniqWith([...topics, objectName], isEqual) });
  };

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
          />
          {props.draftPosts.some(d => d.draftId === props.draftId) && (
            <div className="edit-post__saving-badge">
              {props.saving ? (
                <Badge
                  status="error"
                  text={props.intl.formatMessage({ id: 'saving', defaultMessage: 'Saving...' })}
                />
              ) : (
                <Badge
                  status="success"
                  text={props.intl.formatMessage({ id: 'saved', defaultMessage: 'Saved' })}
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
          <CreateObject onCreateObject={handleCreateObject} />
          {props.filteredObjectsCards.map(wObj => (
            <PostObjectCard
              isLinked={get(objPercentage, [wObj._id, 'percent'], 0) > 0}
              wObject={wObj}
              onToggle={handleToggleLinkedObject}
              key={wObj._id}
            />
          ))}
        </div>
        <div className="rightContainer">
          <div className="right">
            <ObjectCreation />
            <LastDraftsContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

EditPost.propTypes = propTypes;
EditPost.defaultProps = defaultProps;

export default EditPost;
