import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Badge, message } from 'antd';
import {
  debounce,
  get,
  has,
  kebabCase,
  throttle,
  uniqBy,
  isEmpty,
  includes,
  find,
  indexOf,
  uniqWith,
  concat,
  isEqual,
} from 'lodash';
import requiresLogin from '../../auth/requiresLogin';
import { getCampaignById } from '../../../waivioApi/ApiClient';
import {
  getAuthenticatedUser,
  getDraftPosts,
  getIsEditorLoading,
  getIsEditorSaving,
  getIsImageUploading,
  getUpvoteSetting,
  getSuitableLanguage,
  isGuestUser,
  getBeneficiariesUsers,
} from '../../reducers';
import { createPost, saveDraft } from '../Write/editorActions';
import { createPostMetadata, getInitialState, getObjectUrl } from '../../helpers/postHelpers';
import Editor from '../../components/EditorExtended/EditorExtended';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import PostObjectCard from '../PostObjectCard/PostObjectCard';
import { Entity, toMarkdown } from '../../components/EditorExtended';
import LastDraftsContainer from '../Write/LastDraftsContainer';
import ObjectCreation from '../../components/Sidebar/ObjectCreation/ObjectCreation';
import { setObjPercents } from '../../helpers/wObjInfluenceHelper';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import CreateObject from '../CreateObjectModal/CreateObject';

import './EditPost.less';

const getLinkedObjects = contentStateRaw => {
  const objEntities = Object.values(contentStateRaw.entityMap).filter(
    entity => entity.type === Entity.OBJECT && has(entity, 'data.object.type'),
  );
  return uniqBy(
    objEntities.map(entity => entity.data.object),
    'id',
  );
};

@injectIntl
@requiresLogin
@withRouter
@connect(
  (state, props) => ({
    user: getAuthenticatedUser(state),
    locale: getSuitableLanguage(state),
    draftPosts: getDraftPosts(state),
    publishing: getIsEditorLoading(state),
    saving: getIsEditorSaving(state),
    imageLoading: getIsImageUploading(state),
    campaignId: new URLSearchParams(props.location.search).get('campaign'),
    draftId: new URLSearchParams(props.location.search).get('draft'),
    initObjects: new URLSearchParams(props.location.search).getAll('object'),
    upvoteSetting: getUpvoteSetting(state),
    isGuest: isGuestUser(state),
    beneficiaries: getBeneficiariesUsers(state),
  }),
  {
    createPost,
    saveDraft,
  },
)
class EditPost extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    userName: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    draftPosts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    campaignId: PropTypes.string, // eslint-disable-line
    draftId: PropTypes.string,
    publishing: PropTypes.bool,
    saving: PropTypes.bool,
    imageLoading: PropTypes.bool,
    createPost: PropTypes.func,
    saveDraft: PropTypes.func,
    isGuest: PropTypes.bool,
    beneficiaries: PropTypes.arrayOf(PropTypes.shape()),
    history: PropTypes.shape().isRequired,
  };
  static defaultProps = {
    upvoteSetting: false,
    campaignId: '',
    draftId: '',
    publishing: false,
    saving: false,
    imageLoading: false,
    createPost: () => {},
    saveDraft: () => {},
    isGuest: false,
    beneficiaries: [],
  };

  constructor(props) {
    super(props);

    this.state = getInitialState(props);

    this.buildPost = this.buildPost.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleLinkedObject = this.handleToggleLinkedObject.bind(this);
    this.handleTopicsChange = this.handleTopicsChange.bind(this);
    this.handleObjectSelect = this.handleObjectSelect.bind(this);
    this.handleCreateObject = this.handleCreateObject.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.draftId && nextProps.draftId !== prevState.draftId) {
      return getInitialState(nextProps);
    } else if (nextProps.draftId === null && prevState.draftId) {
      const nextState = getInitialState(nextProps);
      nextProps.history.replace({
        pathname: nextProps.location.pathname,
        search: `draft=${nextState.draftId}`,
      });

      return nextState;
    }
    return null;
  }

  componentDidMount() {
    const { campaign } = this.state;
    const currDraft = this.props.draftPosts.find(d => d.draftId === this.props.draftId);
    const campaignId =
      campaign && campaign.id ? campaign.id : get(currDraft, ['jsonMetadata', 'campaignId']);
    const isReview = !isEmpty(campaignId);
    if (isReview)
      getCampaignById(campaignId)
        .then(campaignData => {
          const requiredObj = get(campaignData.requiredObject, 'name', '');
          const secondObj = get(campaignData.objects, '[0].name', '');
          const reviewTitle = `Review: ${requiredObj}, ${secondObj}`;
          return this.setState({
            campaign: { ...campaignData, fetched: true },
            draftContent: {
              title: reviewTitle,
            },
            topics: [requiredObj, secondObj],
          });
        })
        .catch(error => {
          message.error(
            this.props.intl.formatMessage(
              {
                id: 'imageSetter_link_is_already_added',
                defaultMessage: `Failed to get campaign data: {error}`,
              },
              { error },
            ),
          );
        });
  }

  componentDidUpdate(prevProps) {
    const currDraft = this.props.draftPosts.find(d => d.draftId === this.props.draftId);
    if (
      this.props.draftId !== prevProps.draftId &&
      has(currDraft, ['jsonMetadata', 'campaignId'])
    ) {
      getCampaignById(get(currDraft, ['jsonMetadata', 'campaignId']))
        .then(campaignData => this.setState({ campaign: { ...campaignData, fetched: true } }))
        .catch(error => console.log('Failed to get campaign data:', error));
    }
  }

  handleChangeContent(rawContent, title) {
    const nextState = { content: toMarkdown(rawContent), titleValue: title };
    const linkedObjects = uniqBy(
      concat(this.state.linkedObjects, getLinkedObjects(rawContent)),
      'id',
    );

    const isLinkedObjectsChanged = this.state.linkedObjects.length !== linkedObjects.length;
    if (isLinkedObjectsChanged) {
      const objPercentage = setObjPercents(linkedObjects, this.state.objPercentage);
      nextState.linkedObjects = linkedObjects;
      nextState.objPercentage = objPercentage;
    }
    if (
      this.state.content !== nextState.content ||
      isLinkedObjectsChanged ||
      this.state.titleValue !== nextState.titleValue
    ) {
      this.setState(nextState, this.handleUpdateState);
    }
  }

  handleTopicsChange = topics => {
    this.setState({ topics }, this.handleUpdateState);
  };

  handleSettingsChange = updatedValue =>
    this.setState(
      prevState => ({
        settings: { ...prevState.settings, ...updatedValue },
      }),
      this.handleUpdateState,
    );

  handlePercentChange = percentage => {
    this.setState({ objPercentage: percentage }, this.handleUpdateState);
  };

  handleSubmit() {
    const { history } = this.props;
    const postData = this.buildPost();
    const isReview =
      !isEmpty(this.state.campaign) || includes(get(history, ['location', 'search']), 'review');
    this.props.createPost(postData, this.props.beneficiaries, isReview);
  }

  handleToggleLinkedObject(objId, isLinked, uniqId) {
    const { linkedObjects, objPercentage, topics } = this.state;
    const currentObj = find(linkedObjects, { _id: uniqId });
    const switchableObj = indexOf(linkedObjects, currentObj);
    const switchableObjName = switchableObj.name || switchableObj.default_name;

    linkedObjects.splice(switchableObj, 1);
    const updPercentage = {
      ...objPercentage,
      [objId]: { percent: isLinked ? 33 : 0 }, // 33 - just non zero value
    };
    topics.splice(switchableObjName, 1);
    this.setState({
      objPercentage: setObjPercents(linkedObjects, updPercentage),
      topics,
    });
  }

  handleObjectSelect(object) {
    this.setState(prevState => {
      const objName = object.name || object.default_name;
      const separator = this.state.content.slice(-1) === '\n' ? '' : '\n';
      return {
        draftContent: {
          title: this.state.titleValue,
          body: `${this.state.content}${separator}[${objName}](${getObjectUrl(
            object.id || object.author_permlink,
          )})&nbsp;\n`,
        },
        topics: uniqWith([...prevState.topics, objName], isEqual),
      };
    });
  }

  handleCreateObject(object) {
    setTimeout(() => this.handleObjectSelect(object), 1200);
  }

  buildPost() {
    const {
      draftId,
      campaign,
      parentPermlink,
      content,
      topics,
      linkedObjects,
      objPercentage,
      settings,
      isUpdating,
      permlink,
      originalBody,
      titleValue,
    } = this.state;
    const campaignId = get(campaign, '_id', null);
    const postData = {
      body: content,
      title: titleValue,
      lastUpdated: Date.now(),
      isUpdating,
      draftId,
      ...settings,
    };

    if (campaign && campaign.alias) {
      postData.body += `\n***\n${this.props.intl.formatMessage({
        id: `check_review_post_add_text`,
        defaultMessage: 'This review was sponsored in part by',
      })} ${campaign.alias} ([@${campaign.guideName}](/@${campaign.guideName}))`;
    }

    postData.parentAuthor = '';
    postData.parentPermlink = parentPermlink;
    postData.author = this.props.user.name || '';
    postData.permlink = permlink || kebabCase(titleValue);

    const currDraft = this.props.draftPosts.find(d => d.draftId === this.props.draftId);
    const oldMetadata = currDraft && currDraft.jsonMetadata;
    const waivioData = {
      wobjects: linkedObjects
        .filter(obj => objPercentage[obj.id].percent > 0)
        .map(obj => ({
          objectName: obj.name,
          author_permlink: obj.id,
          percent: objPercentage[obj.id].percent,
        })),
    };

    postData.jsonMetadata = createPostMetadata(
      content,
      topics,
      oldMetadata,
      waivioData,
      campaignId,
    );

    if (originalBody) {
      postData.originalBody = originalBody;
    }
    return postData;
  }

  handleUpdateState = () => {
    throttle(this.saveDraft, 200, { leading: false, trailing: true })();
  };

  saveDraft = debounce(() => {
    if (this.props.saving) return;

    const draft = this.buildPost();
    const postBody = draft.originalBody || draft.body;
    if (!postBody) return;

    const redirect = this.props.draftId !== this.state.draftId;

    this.props.saveDraft(draft, redirect, this.props.intl);
  }, 1500);

  handleHashtag = objectType =>
    this.setState(prevState => ({ topics: uniqWith([...prevState.topics, objectType], isEqual) }));

  render() {
    const {
      draftContent,
      content,
      topics,
      linkedObjects,
      objPercentage,
      settings,
      campaign,
      isUpdating,
      titleValue,
    } = this.state;
    const { saving, publishing, imageLoading, intl, locale, draftPosts, isGuest } = this.props;
    return (
      <div className="shifted">
        <div className="post-layout container">
          <div className="center">
            <Editor
              enabled={!imageLoading}
              initialContent={draftContent}
              locale={locale}
              onChange={this.handleChangeContent}
              intl={intl}
              handleHashtag={this.handleHashtag}
            />
            {draftPosts.some(d => d.draftId === this.state.draftId) && (
              <div className="edit-post__saving-badge">
                {saving ? (
                  <Badge
                    status="error"
                    text={intl.formatMessage({ id: 'saving', defaultMessage: 'Saving...' })}
                  />
                ) : (
                  <Badge
                    status="success"
                    text={intl.formatMessage({ id: 'saved', defaultMessage: 'Saved' })}
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
              onUpdate={this.saveDraft}
              reviewData={
                campaign && campaign.fetched
                  ? { campaign, reviewer: { name: this.props.userName } }
                  : null
              }
              settings={settings}
              topics={topics}
              onPercentChange={this.handlePercentChange}
              onSettingsChange={this.handleSettingsChange}
              onSubmit={this.handleSubmit}
              onTopicsChange={this.handleTopicsChange}
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
              handleSelect={this.handleObjectSelect}
            />
            <CreateObject onCreateObject={this.handleCreateObject} />

            {linkedObjects.map(wObj => (
              <PostObjectCard
                isLinked={get(objPercentage, [wObj.id, 'percent'], 0) > 0}
                wObject={wObj}
                onToggle={this.handleToggleLinkedObject}
                key={wObj.id}
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
  }
}

export default EditPost;
