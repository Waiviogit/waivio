import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { forEach, get, isEmpty, map, size } from 'lodash';
import readingTime from 'reading-time';
import {
  FormattedDate,
  FormattedMessage,
  FormattedNumber,
  FormattedRelative,
  FormattedTime,
  injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Collapse } from 'antd';
import Lightbox from 'react-image-lightbox';
import { extractImageTags } from '../../../common/helpers/parser';
import {
  dropCategory,
  isPostDeleted,
  replaceBotWithGuestName,
} from '../../../common/helpers/postHelpers';
import withAuthActions from '../../auth/withAuthActions';
import BTooltip from '../BTooltip';
import { getHtml } from './Body';
import BodyContainer from '../../containers/Story/BodyContainer';
import StoryDeleted from './StoryDeleted';
import StoryFooter from '../StoryFooter/StoryFooter';
import Avatar from '../Avatar';
import PostedFrom from './PostedFrom';
import ObjectCardView from '../../objectCard/ObjectCardView';
import WeightTag from '../WeightTag';
import { AppSharedContext } from '../../Wrapper';
import PostPopoverMenu from '../PostPopoverMenu/PostPopoverMenu';
import { getImagePathPost } from '../../../common/helpers/image';
import MuteModal from '../../widgets/MuteModal';
import { muteAuthorPost } from '../../../store/postsStore/postActions';
import PropositionNew from '../../newRewards/reuseble/Proposition/Proposition';
import Campaing from '../../newRewards/reuseble/Campaing';

import './StoryFull.less';
import LightboxHeader from '../../widgets/LightboxTools/LightboxHeader';

@injectIntl
@withRouter
@withAuthActions
@connect(null, {
  muteAuthorPost,
})
class StoryFull extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number,
    onActionInitiated: PropTypes.func.isRequired,
    muteAuthorPost: PropTypes.func.isRequired,
    signature: PropTypes.string,
    pendingLike: PropTypes.bool,
    pendingFlag: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingBookmark: PropTypes.bool,
    commentCount: PropTypes.number,
    saving: PropTypes.bool,
    ownPost: PropTypes.bool,
    sliderMode: PropTypes.bool,
    onFollowClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onReportClick: PropTypes.func,
    onLikeClick: PropTypes.func,
    onShareClick: PropTypes.func,
    onEditClick: PropTypes.func,
    isOriginalPost: PropTypes.string,
    isModal: PropTypes.bool,
  };

  static defaultProps = {
    signature: null,
    pendingLike: false,
    pendingFlag: false,
    pendingFollow: false,
    pendingBookmark: false,
    commentCount: 0,
    saving: false,
    ownPost: false,
    sliderMode: false,
    onFollowClick: () => {},
    onSaveClick: () => {},
    onReportClick: () => {},
    onLikeClick: () => {},
    onShareClick: () => {},
    onEditClick: () => {},
    setVisibleMuteModal: () => {},
    postState: {},
    isOriginalPost: '',
    defaultVotePercent: 0,
    match: {},
    history: {},
    isModal: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeKey: 1,
      showObjects: false,
      lightbox: {
        open: false,
        index: 0,
      },
      loadingAssign: false,
      visible: false,
    };

    this.images = [];
    this.imagesAlts = [];

    this.handleClick = this.handleClick.bind(this);
    this.handleContentClick = this.handleContentClick.bind(this);
  }
  componentDidMount() {
    const taggedObjects = [];
    const linkedObjects = [];

    forEach(this.props.post.wobjects, wobj => {
      if (wobj.tagged) taggedObjects.push(wobj);
      else linkedObjects.push(wobj);
    });
    if (window.location.hash) {
      setTimeout(() => {
        const hash = window.location.hash;

        window.location.hash = '';
        window.location.hash = hash;
        this.setState({ activeKey: !isEmpty(linkedObjects) ? 1 : 2 });
      }, 300);
    }
  }

  componentWillUnmount() {
    const { post } = this.props;
    const hideWhiteBG =
      document &&
      document.location.pathname !==
        replaceBotWithGuestName(dropCategory(post.url), post.guestInfo);

    if (hideWhiteBG) {
      document.body.classList.remove('white-bg');
    }
  }

  handleMutePostAuthor = post =>
    post.muted ? this.props.muteAuthorPost(post) : this.setState({ visible: true });

  clickMenuItem(key) {
    const { post, postState } = this.props;

    switch (key) {
      case 'follow':
        this.props.onFollowClick(post);
        break;
      case 'save':
        this.props.onSaveClick(post);
        break;
      case 'report':
        this.props.onReportClick(post, postState);
        break;
      case 'edit':
        this.props.onEditClick(post);
        break;
      case 'mute':
        this.handleMutePostAuthor(post);
        break;
      default:
    }
  }

  handleClick(key) {
    this.props.onActionInitiated(this.clickMenuItem.bind(this, key));
  }

  handleContentClick(e) {
    if (e.target.tagName === 'IMG' && this.images) {
      const tags = this.contentDiv.getElementsByTagName('img');

      for (let i = 0; i < tags.length; i += 1) {
        if (tags[i] === e.target && this.images.length > i) {
          if (e.target?.parentNode && e.target?.parentNode.tagName === 'A') return;
          this.setState({
            lightbox: {
              open: true,
              index: i,
            },
          });
        }
      }
    }
  }
  closeLightboxModal = linkedObjects => {
    this.setState({ lightbox: { open: false }, activeKey: !isEmpty(linkedObjects) ? 1 : 2 });
  };

  toggleBookmark = () => this.clickMenuItem('save');

  render() {
    const {
      intl,
      user,
      post,
      postState,
      signature,
      pendingLike,
      pendingFlag,
      pendingFollow,
      pendingBookmark,
      commentCount,
      saving,
      rewardFund,
      ownPost,
      sliderMode,
      defaultVotePercent,
      onLikeClick,
      onShareClick,
      onEditClick,
      isOriginalPost,
      isModal,
    } = this.props;
    const taggedObjects = [];
    const linkedObjects = [];
    const authorName = get(post, ['guestInfo', 'userId'], '') || post.author;
    const imagesArraySize = size(this.images);

    forEach(post.wobjects, wobj => {
      if (wobj.tagged) taggedObjects.push(wobj);
      else linkedObjects.push(wobj);
    });
    const { open, index } = this.state.lightbox;
    const getImagePath = item => getImagePathPost(item);
    const parsedBody = getHtml(post.body, {}, 'text');

    this.images = extractImageTags(parsedBody).map(image => ({
      ...image,
      src: getImagePath(image.src),
    }));

    const body = this.images.reduce(
      (acc, item) => acc.replace(`<center>${item.alt}</center>`, ''),
      post.body,
    );

    let signedBody = body.replaceAll('http://', 'https://');

    if (signature) signedBody = `${body}<hr>${signature}`;

    let replyUI = null;

    if (post.depth !== 0 && !isOriginalPost) {
      replyUI = (
        <div className="StoryFull__reply">
          <h3 className="StoryFull__reply__title">
            <FormattedMessage
              id="post_reply_title"
              defaultMessage="This is a reply to: {title}"
              values={{ title: post.root_title }}
            />
          </h3>
          <h4>
            <Link to={dropCategory(post.url)}>
              <FormattedMessage
                id="post_reply_show_original_post"
                defaultMessage="Show original post"
              />
            </Link>
          </h4>
          {post.depth > 1 && (
            <h4>
              <Link to={`/@${post.parent_author}/${post.parent_permlink}`}>
                <FormattedMessage
                  id="post_reply_show_parent_discussion"
                  defaultMessage="Show parent discussion"
                />
              </Link>
            </h4>
          )}
        </div>
      );
    }

    let content = null;

    if (isPostDeleted(post)) {
      content = <StoryDeleted />;
    } else {
      content = (
        <div
          role="presentation"
          ref={div => {
            this.contentDiv = div;
          }}
          onClick={this.handleContentClick}
        >
          <BodyContainer
            full
            body={signedBody}
            json_metadata={post.json_metadata}
            isModal={isModal}
            isGuest={!isEmpty(post.guestInfo)}
          />
        </div>
      );
    }

    return (
      <div className="StoryFull">
        {replyUI}
        <h1 className="StoryFull__title">{post.title}</h1>
        {!isOriginalPost && (
          <h3 className="StoryFull__comments_title">
            <a href="#comments">
              {commentCount === 1 ? (
                <FormattedMessage
                  id="comment_count"
                  values={{ count: <FormattedNumber value={commentCount} /> }}
                  defaultMessage="{count} comment"
                />
              ) : (
                <FormattedMessage
                  id="comments_count"
                  values={{ count: <FormattedNumber value={commentCount} /> }}
                  defaultMessage="{count} comments"
                />
              )}
            </a>
          </h3>
        )}
        <div className="StoryFull__header">
          <Link to={`/@${authorName}`}>
            <Avatar username={authorName} size={60} />
          </Link>
          <div className="StoryFull__header__text">
            <Link to={`/@${authorName}`}>
              <span className="username">{authorName}</span>
              <WeightTag weight={post.author_wobjects_weight} />
            </Link>
            <BTooltip
              title={
                <span>
                  <FormattedDate value={`${post.created}Z`} />{' '}
                  <FormattedTime value={`${post.created}Z`} />
                </span>
              }
            >
              <span className="StoryFull__header__text__date">
                <FormattedRelative value={`${post.created}Z`} />
              </span>
            </BTooltip>
            <span className="StoryFull__posted_from">
              <PostedFrom post={post} />
            </span>
            {Math.ceil(readingTime(post.body).minutes) > 1 && (
              <span>
                <span className="StoryFull__bullet" />
                <BTooltip
                  title={
                    <span>
                      <FormattedMessage
                        id="words_tooltip"
                        defaultMessage={'{words} words'}
                        values={{ words: readingTime(post.body).words }}
                      />
                    </span>
                  }
                >
                  <span className="StoryFull__header__reading__time">
                    <FormattedMessage
                      id="reading_time_post"
                      defaultMessage={'{min} min read'}
                      values={{ min: Math.ceil(readingTime(post.body).minutes) }}
                    />
                  </span>
                </BTooltip>
              </span>
            )}
          </div>
          <PostPopoverMenu
            pendingFlag={pendingFlag}
            pendingFollow={pendingFollow}
            pendingBookmark={pendingBookmark}
            saving={saving}
            postState={postState}
            intl={intl}
            post={post}
            handlePostPopoverMenuClick={this.handleClick}
            ownPost={ownPost}
          >
            <i className="StoryFull__header__more iconfont icon-more" />
          </PostPopoverMenu>
        </div>
        <div className="StoryFull__content">{content}</div>
        {open && (
          <Lightbox
            wrapperClassName="LightboxTools"
            imageTitle={
              <LightboxHeader
                relatedWobjs={post.wobjects}
                closeModal={() => this.closeLightboxModal(linkedObjects)}
                relatedPath={!isEmpty(linkedObjects) ? '#allLinkedObjects' : '#allRelatedObjects'}
                userName={post.author}
              />
            }
            mainSrc={this.images[index].src}
            nextSrc={imagesArraySize > 1 && this.images[(index + 1) % imagesArraySize].src}
            prevSrc={
              imagesArraySize > 1 &&
              this.images[(index + (imagesArraySize - 1)) % imagesArraySize].src
            }
            onCloseRequest={() => {
              this.setState({
                lightbox: {
                  ...this.state.lightbox,
                  open: false,
                },
              });
            }}
            onMovePrevRequest={() =>
              this.setState({
                lightbox: {
                  ...this.state.lightbox,
                  index: (index + (imagesArraySize - 1)) % imagesArraySize,
                },
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                lightbox: {
                  ...this.state.lightbox,
                  index: (index + (this.images.length + 1)) % this.images.length,
                },
              })
            }
          />
        )}

        <Collapse
          onChange={() => this.setState({ activeKey: this.state.activeKey === 1 ? 2 : 1 })}
          accordion
          defaultActiveKey={['1']}
          activeKey={this.state.activeKey}
        >
          {!isEmpty(linkedObjects) && (
            <Collapse.Panel
              id="allLinkedObjects"
              header={`${intl.formatMessage({
                id: 'editor_linked_objects',
                defaultMessage: 'Linked objects',
              })} ${linkedObjects.length}`}
              key="1"
            >
              {map(linkedObjects, obj => {
                if (obj.campaigns) {
                  const minReward = get(obj, ['campaigns', 'min_reward']);
                  const maxReward = get(obj, ['campaigns', 'max_reward']);

                  return <Campaing campain={{ minReward, maxReward, object: obj }} />;
                }

                if (!isEmpty(obj.propositions)) {
                  return obj.propositions.map(proposition => (
                    <PropositionNew
                      key={proposition._id}
                      proposition={{
                        ...proposition,
                        object: obj,
                        requiredObject: !isEmpty(obj.parent)
                          ? obj.parent
                          : proposition?.requiredObject,
                      }}
                    />
                  ));
                }

                return (
                  <div className="CardView">
                    <ObjectCardView wObject={obj} passedParent={obj.parent} />
                  </div>
                );
              })}
            </Collapse.Panel>
          )}
          {!isEmpty(taggedObjects) && (
            <Collapse.Panel
              id="allRelatedObjects"
              header={`${intl.formatMessage({
                id: 'objects_related_by_tags',
                defaultMessage: 'Objects related by #tags',
              })} ${taggedObjects.length}`}
              key="2"
            >
              {map(taggedObjects, obj => {
                const wobj = obj;

                return <ObjectCardView key={`${wobj._id}`} wObject={wobj} />;
              })}
            </Collapse.Panel>
          )}
        </Collapse>
        <StoryFooter
          user={user}
          post={post}
          postState={postState}
          pendingLike={pendingLike}
          pendingFlag={pendingFlag}
          pendingFollow={pendingFollow}
          pendingBookmark={pendingBookmark}
          ownPost={ownPost}
          singlePostVew
          rewardFund={rewardFund}
          saving={saving}
          sliderMode={sliderMode}
          defaultVotePercent={defaultVotePercent}
          onReportClick={this.props.onReportClick}
          onLikeClick={onLikeClick}
          onShareClick={onShareClick}
          onEditClick={onEditClick}
          handleEditClick={onEditClick}
          toggleBookmark={this.toggleBookmark}
        />
        <MuteModal
          item={post}
          type={'post'}
          visible={this.state.visible}
          setVisibleMuteModal={state => this.setState({ visible: state })}
          username={post.author}
        />
      </div>
    );
  }
}

export default props => (
  <AppSharedContext.Consumer>
    {context => <StoryFull {...props} {...context} />}
  </AppSharedContext.Consumer>
);
