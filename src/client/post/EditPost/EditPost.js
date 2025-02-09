import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'antd';
import { withRouter } from 'react-router';
import { debounce, get, includes, find, uniqWith, isEqual, isEmpty } from 'lodash';
import { getInitialState } from '../../../common/helpers/postHelpers';
import Editor from '../../components/EditorExtended/EditorExtendedComponent';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import PostObjectCard from '../PostObjectCard/PostObjectCard';
import LastDraftsContainer from '../Write/LastDraftsContainer';
import ObjectCreation from '../../components/Sidebar/ObjectCreation/ObjectCreation';
import { setObjPercents } from '../../../common/helpers/wObjInfluenceHelper';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import CreateObject from '../CreateObjectModal/CreateObject';
import { editorStateToMarkdownSlate } from '../../components/EditorExtended/util/editorStateToMarkdown';
import { parseJSON } from '../../../common/helpers/parseJSON';
import Loading from '../../components/Icon/Loading';

import './EditPost.less';

const propTypes = {
  intl: PropTypes.shape().isRequired,
  locale: PropTypes.string.isRequired,
  draftPosts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  objPercentage: PropTypes.arrayOf(PropTypes.shape()),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  draftId: PropTypes.string,
  campaignId: PropTypes.string,
  publishing: PropTypes.bool,
  saving: PropTypes.bool,
  imageLoading: PropTypes.bool,
  createPost: PropTypes.func,
  setObjPercent: PropTypes.func,
  saveDraft: PropTypes.func,
  buildPost: PropTypes.func.isRequired,
  leaveEditor: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  handleObjectSelect: PropTypes.func.isRequired,
  setUpdatedEditorData: PropTypes.func.isRequired,
  isWaivio: PropTypes.bool,
  isGuest: PropTypes.bool,
  beneficiaries: PropTypes.arrayOf(PropTypes.shape()),
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  editor: PropTypes.shape().isRequired,
  currDraft: PropTypes.shape().isRequired,
  filteredObjectsCards: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handlePasteText: PropTypes.func.isRequired,
};

const defaultProps = {
  draftId: '',
  campaignId: '',
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
      settings,
      campaign,
      isUpdating,
      titleValue,
    },
    draftId,
    objPercentage,
  } = props;
  const [isNewReview, setIsNewReview] = React.useState(false);
  const [init, setInit] = React.useState(Boolean(props.currDraft));
  const hideLinkedObjectsSession = parseJSON(localStorage.getItem(props.draftId)) || [];
  const campaignId = props.campaignId || props.currDraft?.jsonMetadata?.campaignId;

  React.useEffect(() => {
    const isReview = !isEmpty(campaignId);

    props.setEditorState(
      getInitialState({ ...props, draftId: props.draftId }, hideLinkedObjectsSession),
    );
    props.setUpdatedEditorData({ isReview, hideLinkedObjects: hideLinkedObjectsSession });

    props.history.replace({
      pathname: props.location.pathname,
      search: `draft=${draftId}`,
    });

    return () => {
      props.leaveEditor();
    };
  }, []);

  React.useEffect(() => {
    setIsNewReview(!props.draftPosts.some(d => d.draftId === props.draftId));

    props.setEditorState(getInitialState(props, hideLinkedObjectsSession));
    const editorData = {
      title: get(props.currDraft, 'title', '') || get(props.editor, 'draftContent.title', ''),
      body: get(props.currDraft, 'body', '') || get(props.editor, 'draftContent.body', ''),
    };

    if (editorData.title || editorData.body) props.setUpdatedEditorData(editorData);
  }, [props.currDraft]);

  const handleChangeContent = useCallback(
    debounce((editor, title) => {
      const updatedStore = {
        content: editorStateToMarkdownSlate(editor.children),
        titleValue: title,
      };

      if ((content !== updatedStore.content || titleValue !== updatedStore.titleValue) && !init) {
        props.saveDraft(updatedStore);
        props.setUpdatedEditorData(updatedStore);
      } else {
        setInit(false);
      }
    }, 500),
    [content, titleValue, props.currDraft, init],
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
    localStorage.setItem(props.draftId, JSON.stringify(prohibitedObjectCards));

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

  const handlePasteText = (text, html) => props.handlePasteText(html);

  if (props.campaignId) return <Loading />;

  return (
    <div className="shifted">
      <div className="post-layout container container-edit-post">
        <div className="center">
          <Editor
            isNewReview={isNewReview}
            enabled={!props.imageLoading}
            initialContent={draftContent}
            locale={props.locale}
            onChange={handleChangeContent}
            intl={props.intl}
            handleHashtag={handleHashtag}
            displayTitle
            draftId={props.draftId}
            handlePasteText={handlePasteText}
            match={props.match}
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
            setObjPercent={props.setObjPercent}
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
              isLinked={get(objPercentage, [wObj.author_permlink, 'percent'], 0) > 0}
              wObject={wObj}
              onToggle={handleToggleLinkedObject}
              key={wObj.author_permlink}
            />
          ))}
        </div>
        <div className="rightContainer edit-post__right-container">
          <div className="right right-edit-post">
            <div className="edit-post__objects-container">
              <ObjectCreation onCreateObject={handleCreateObject} />
            </div>
            <LastDraftsContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

EditPost.propTypes = propTypes;
EditPost.defaultProps = defaultProps;

export default withRouter(EditPost);
