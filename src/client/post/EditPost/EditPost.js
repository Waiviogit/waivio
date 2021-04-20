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
  includes,
  find,
  indexOf,
  uniqWith,
  concat,
  isEqual,
  isEmpty,
} from 'lodash';
import requiresLogin from '../../auth/requiresLogin';
import { getReviewCheckInfo } from '../../../waivioApi/ApiClient';
import { getSuitableLanguage } from '../../store/reducers';
import { createPost, saveDraft } from '../../store/editorStore/editorActions';
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
import { getObjectName } from '../../helpers/wObjectHelper';
import { getCurrentHost, getIsWaivio } from '../../store/appStore/appSelectors';
import { getAuthenticatedUser, isGuestUser } from '../../store/authStore/authSelectors';
import {
  getDraftPosts,
  getIsEditorLoading,
  getIsEditorSaving,
  getIsImageUploading,
} from '../../store/editorStore/editorSelectors';
import { getUpvoteSetting } from '../../store/settingsStore/settingsSelectors';
import { getBeneficiariesUsers } from '../../store/searchStore/searchSelectors';
import { getLinkedObjects } from '../../helpers/editorHelper';

import './EditPost.less';

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
    upvoteSetting: getUpvoteSetting(state),
    isGuest: isGuestUser(state),
    beneficiaries: getBeneficiariesUsers(state),
    host: getCurrentHost(state),
    isWaivio: getIsWaivio(state),
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
    isWaivio: PropTypes.bool,
    isGuest: PropTypes.bool,
    beneficiaries: PropTypes.arrayOf(PropTypes.shape()),
    history: PropTypes.shape().isRequired,
    host: PropTypes.string.isRequired,
  };
  static defaultProps = {
    upvoteSetting: false,
    campaignId: '',
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
    const { locale, userName } = this.props;
    const currDraft = this.props.draftPosts.find(d => d.draftId === this.props.draftId);
    const campaignId =
      campaign && campaign.id ? campaign.id : get(currDraft, ['jsonMetadata', 'campaignId']);
    const isReview = !isEmpty(campaignId);
    const linkedObjectsCards = JSON.parse(sessionStorage.getItem('linkedObjectsCards')) || [];

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ isReview, linkedObjectsCards });
    const postPermlink = get(currDraft, 'permlink');

    if (isReview) {
      const isPublicReview = postPermlink;

      getReviewCheckInfo({ campaignId, locale, userName, isPublicReview })
        .then(campaignData => {
          this.getReviewTitle(campaignData);
          this.setState({
            campaign: campaignData,
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
  }

  componentDidUpdate(prevProps) {
    const { locale, userName, intl } = this.props;
    const currDraft = this.props.draftPosts.find(d => d.draftId === this.props.draftId);
    const postPermlink = get(currDraft, 'permlink');
    const campaignId = get(currDraft, ['jsonMetadata', 'campaignId']);

    if (
      this.props.draftId !== prevProps.draftId &&
      has(currDraft, ['jsonMetadata', 'campaignId'])
    ) {
      const isPublicReview = postPermlink;

      getReviewCheckInfo({ campaignId, locale, userName, isPublicReview })
        .then(campaignData => {
          this.setState({
            campaign: campaignData,
          });
        })
        .catch(() =>
          message.error(
            intl.formatMessage({
              id: 'get_campaign_data_error',
              defaultMessage: 'Failed to get campaign data',
            }),
          ),
        );

      getReviewCheckInfo({ campaignId, locale, userName, postPermlink })
        .then(campaignData => {
          this.setState({
            campaign: campaignData,
          });
        })
        .catch(() =>
          message.error(
            intl.formatMessage({
              id: 'get_campaign_data_error',
              defaultMessage: 'Failed to get campaign data',
            }),
          ),
        );
    }
  }

  getReviewTitle = campaignData => {
    const { linkedObjects } = this.state;
    const firstTitle = get(campaignData, 'requiredObject.name', '');
    const secondTitle = get(campaignData, 'secondaryObject.name', '');
    const requiredObj = get(linkedObjects, '[0]', '');
    const secondObj = get(linkedObjects, '[1]', '');
    const reviewTitle = `Review: ${firstTitle}, ${secondTitle}`;

    const topics = [];

    if (requiredObj.object_type === 'hashtag' || secondObj.object_type === 'hashtag') {
      topics.push(requiredObj.author_permlink || secondObj.author_permlink);
    }

    return this.setState({
      draftContent: {
        title: reviewTitle,
        body: this.state.draftContent.body,
      },
      topics,
    });
  };

  setCurrentDraftContent = debounce((nextState, rawContent) => {
    const prevValue = get(this.state.currentRawContent, 'entityMap', []);
    const nextValue = get(rawContent, 'entityMap', []);

    const prevEntityMap = Object.values(prevValue);
    const nextEntityMap = Object.values(nextValue);

    if (!isEqual(prevEntityMap, nextEntityMap)) {
      this.setState({
        draftContent: {
          body: nextState.content,
          title: nextState.titleValue,
        },
        currentRawContent: rawContent,
      });
    }
  }, 500);

  handleChangeContent(rawContent, title) {
    const {
      linkedObjects: linkedObjectsState,
      objPercentage: objPercentageState,
      content,
      titleValue,
    } = this.state;
    const nextState = { content: toMarkdown(rawContent), titleValue: title };
    const linkedObjects = uniqBy(concat(linkedObjectsState, getLinkedObjects(rawContent)), '_id');

    const isLinkedObjectsChanged = linkedObjectsState.length !== linkedObjects.length;

    if (isLinkedObjectsChanged) {
      const objPercentage = setObjPercents(linkedObjects, objPercentageState);

      sessionStorage.setItem('linkedObjects', JSON.stringify(linkedObjects || []));
      nextState.linkedObjects = linkedObjects;
      nextState.objPercentage = objPercentage;
    }
    if (
      content !== nextState.content ||
      isLinkedObjectsChanged ||
      titleValue !== nextState.titleValue
    ) {
      this.setState(nextState, this.handleUpdateState);
      this.setCurrentDraftContent(nextState, rawContent);
    }
  }

  handleChangeTitle = titleValue => this.setState({ titleValue });

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
    const { history, intl } = this.props;
    const { campaign } = this.state;
    const postData = this.buildPost();
    const isReview =
      !isEmpty(this.state.campaign) || includes(get(history, ['location', 'search']), 'review');

    this.props.createPost(postData, this.props.beneficiaries, isReview, campaign, intl);
  }

  handleToggleLinkedObject(objId, isLinked, uniqId) {
    const { linkedObjects, objPercentage, topics, linkedObjectsCards } = this.state;
    const prohibitedObjectCards = linkedObjectsCards || [];
    const currentObj = find(linkedObjects, { _id: uniqId });
    const switchableObj = indexOf(linkedObjects, currentObj);
    const switchableObjPermlink = currentObj.author_permlink;
    const indexSwitchableHashtag = topics.indexOf(switchableObjPermlink);

    if (!isLinked) {
      linkedObjects.splice(switchableObj, 1);
      topics.splice(indexSwitchableHashtag, 1);
    }
    const updPercentage = {
      ...objPercentage,
      [objId || uniqId]: { percent: isLinked ? 33 : 0 }, // 33 - just non zero value
    };

    prohibitedObjectCards.push(currentObj);
    sessionStorage.setItem('linkedObjectsCards', JSON.stringify(prohibitedObjectCards));
    this.setState({
      objPercentage: setObjPercents(linkedObjects, updPercentage),
      linkedObjectsCards: prohibitedObjectCards,
      topics,
    });
  }

  handleObjectSelect(object) {
    this.setState(prevState => {
      const objName = getObjectName(object).toLowerCase();
      const objPermlink = object.author_permlink;
      const separator = this.state.content.slice(-1) === '\n' ? '' : '\n';

      return {
        draftContent: {
          title: this.state.titleValue,
          body: `${this.state.content}${separator}[${objName}](${getObjectUrl(
            object.id || objPermlink,
          )})&nbsp;\n`,
        },
        topics: uniqWith(
          object.type === 'hashtag' ||
            (object.object_type === 'hashtag' && [...prevState.topics, objPermlink]),
          isEqual,
        ),
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
    const currentObject = get(linkedObjects, '[0]', {});
    const objName = currentObject.author_permlink;

    if (currentObject.type === 'hashtag' || (currentObject.object_type === 'hashtag' && objName)) {
      this.setState(prevState => ({ topics: uniqWith([...prevState.topics, objName], isEqual) }));
    }
    const campaignId = get(campaign, '_id', null);
    const postData = {
      body: content,
      lastUpdated: Date.now(),
      isUpdating,
      draftId,
      ...settings,
    };

    if (titleValue) {
      postData.title = titleValue;
      postData.permlink = permlink || kebabCase(titleValue);
    }

    postData.parentAuthor = '';
    postData.parentPermlink = parentPermlink;
    postData.author = this.props.user.name || '';

    const currDraft = this.props.draftPosts.find(d => d.draftId === this.props.draftId);
    const oldMetadata = currDraft && currDraft.jsonMetadata;

    const waivioData = {
      wobjects: linkedObjects
        .filter(obj => objPercentage[obj.id].percent > 0)
        .map(obj => ({
          object_type: obj.object_type,
          objectName: getObjectName(obj),
          author_permlink: obj.author_permlink,
          percent: get(objPercentage, [obj.id, 'percent']),
        })),
    };

    postData.jsonMetadata = createPostMetadata(
      content,
      topics,
      oldMetadata,
      waivioData,
      campaignId,
      this.props.host,
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

  handleHashtag = objectName =>
    this.setState(prevState => ({ topics: uniqWith([...prevState.topics, objectName], isEqual) }));
  handleLinkedObjectsCards = linkedObjectsCards => this.setState({ linkedObjectsCards });

  render() {
    const {
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
    } = this.state;
    const {
      saving,
      publishing,
      imageLoading,
      intl,
      locale,
      draftPosts,
      isGuest,
      draftId,
    } = this.props;

    const filteredObjectsCards = linkedObjects.filter(
      object => !find(linkedObjectsCards, { _id: object._id }),
    );

    return (
      <div className="shifted">
        <div className="post-layout container">
          <div className="center">
            <Editor
              enabled={!imageLoading}
              initialContent={draftContent}
              locale={locale}
              onChange={this.handleChangeContent}
              handleChangeTitle={this.handleChangeTitle}
              intl={intl}
              handleHashtag={this.handleHashtag}
              displayTitle
              draftId={draftId}
              linkedObjectsCards={linkedObjectsCards}
              handleLinkedObjectsCards={this.handleLinkedObjectsCards}
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
              reviewData={campaign}
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
              addHashtag={!this.props.isWaivio}
            />
            <CreateObject onCreateObject={this.handleCreateObject} />
            {filteredObjectsCards.map(wObj => (
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
