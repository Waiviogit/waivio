import moment from 'moment/moment';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'antd';
import { withRouter } from 'react-router';
import { debounce, get, includes, find, uniqWith, isEqual, isEmpty } from 'lodash';
import { getInitialState } from '../../../common/helpers/postHelpers';
import { createNewCampaing, validateActivateCampaing } from '../../../waivioApi/ApiClient';
import * as apiConfig from '../../../waivioApi/config.json';
import Editor from '../../components/EditorExtended/EditorExtendedComponent';
import GiveawayModal from '../Giveaway/GiveawayModal';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import PostObjectCard from '../PostObjectCard/PostObjectCard';
import LastDraftsContainer from '../Write/LastDraftsContainer';
import ObjectCreation from '../../components/Sidebar/ObjectCreation/ObjectCreation';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import CreateObject from '../CreateObjectModal/CreateObject';
import { editorStateToMarkdownSlate } from '../../components/EditorExtended/util/editorStateToMarkdown';
import Loading from '../../components/Icon/Loading';

import './EditPost.less';

const EditPost = props => {
  const {
    editor: { draftContent, content, topics, settings, isUpdating, titleValue },
    draftId,
    objPercentage,
  } = props;
  const [isNewReview, setIsNewReview] = React.useState(false);
  const [giveawayData, setGiveawayData] = React.useState(null);
  const campaignId = props.campaignId || props.currDraft?.jsonMetadata?.campaignId;

  React.useEffect(() => {
    const isReview = !isEmpty(campaignId);

    props.setEditorState(getInitialState({ ...props, draftId: props.draftId }));
    props.setUpdatedEditorData({ isReview });

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

    props.setEditorState(getInitialState(props));
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

      if (content !== updatedStore.content || titleValue !== updatedStore.titleValue) {
        props.saveDraft(updatedStore);
        props.setUpdatedEditorData(updatedStore);
      }
    }, 500),
    [content, titleValue, props.currDraft],
  );

  const handleSettingsChange = updatedValue =>
    props.setUpdatedEditorData({ settings: { ...settings, ...updatedValue } });

  const handleSubmit = () => {
    const postData = props.buildPost();
    const isReview =
      !isEmpty(props.campaign) || includes(get(props.history, ['location', 'search']), 'review');

    props
      .createPost(postData, props.beneficiaries, isReview, props.campaign, giveawayData)
  };

  const handleToggleLinkedObject = (objId, isLinked) => {
    const currentObj = find(props.filteredObjectsCards, { author_permlink: objId });
    const switchableObjPermlink = currentObj.author_permlink;
    const indexSwitchableHashtag = topics.indexOf(switchableObjPermlink);
    const updPercentage = {
      ...objPercentage,
      [objId]: { percent: isLinked ? 33 : 0 }, // 33 - just non zero value
    };

    if (!isLinked) {
      topics.splice(indexSwitchableHashtag, 1);
    }

    const newLinkedObj = isLinked
      ? props.filteredObjectsCards
      : props.filteredObjectsCards.filter(object => object.author_permlink !== objId);

    props.setUpdatedEditorData({
      topics,
    });

    props.toggleLinkedObj({
      linkedObjects: newLinkedObj,
      objPercentage: updPercentage,
    });
  };

  const handleObjectSelect = object => props.handleObjectSelect(object);

  const handleCreateObject = object => props.handleObjectSelect(object);

  const handleHashtag = objectName => {
    props.setUpdatedEditorData({ topics: uniqWith([...topics, objectName], isEqual) });
  };

  const handlePasteText = (text, html) => props.handlePasteText(html);

  const safeGiveawayData = data => setGiveawayData(data);

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
          <GiveawayModal isEdit={isUpdating} saveData={safeGiveawayData} />
          <div className="edit-post__saving-badge">
            {props.draftPosts.some(d => d.draftId === props.draftId) && (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </div>
          <PostPreviewModal
            content={content}
            isPublishing={props.publishing}
            isUpdating={isUpdating}
            linkedObjects={props.filteredObjectsCards}
            objPercentage={objPercentage}
            reviewData={props?.campaign}
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

EditPost.propTypes = {
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
  toggleLinkedObj: PropTypes.func,
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
  campaign: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  editor: PropTypes.shape().isRequired,
  currDraft: PropTypes.shape(),
  filteredObjectsCards: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handlePasteText: PropTypes.func.isRequired,
};
EditPost.defaultProps = {
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

export default withRouter(EditPost);
