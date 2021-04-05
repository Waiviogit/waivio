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
import { Collapse, message } from 'antd';
import Lightbox from 'react-image-lightbox';
import { extractImageTags } from '../../helpers/parser';
import { dropCategory, isPostDeleted, replaceBotWithGuestName } from '../../helpers/postHelpers';
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
import Campaign from '../../rewards/Campaign/Campaign';
import Proposition from '../../rewards/Proposition/Proposition';
import * as apiConfig from '../../../waivioApi/config.json';
import { assignProposition } from '../../user/userActions';
import { getImagePathPost } from '../../helpers/image';
import MuteModal from '../../widgets/MuteModal';
import { muteAuthorPost } from '../../post/postActions';

import './StoryFull.less';

@injectIntl
@withRouter
@withAuthActions
@connect(null, {
  assignProposition,
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
    match: PropTypes.shape(),
    assignProposition: PropTypes.func,
    history: PropTypes.shape(),
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
    assignProposition: () => {},
    declineProposition: () => {},
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
          if (e.target.parentNode && e.target.parentNode.tagName === 'A') return;
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

  assignPropositionHandler = ({
    companyAuthor,
    companyPermlink,
    resPermlink,
    objPermlink,
    primaryObjectName,
    secondaryObjectName,
    amount,
    proposition,
    proposedWobj,
    userName,
    currencyId,
  }) => {
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';

    this.setState({ loadingAssign: true });
    this.props
      .assignProposition({
        companyAuthor,
        companyPermlink,
        objPermlink,
        resPermlink,
        appName,
        primaryObjectName,
        secondaryObjectName,
        amount,
        proposition,
        proposedWobj,
        userName,
        currencyId,
      })
      .then(() => {
        message.success(
          this.props.intl.formatMessage({
            id: 'assigned_successfully',
            defaultMessage: 'Assigned successfully',
          }),
        );
        this.setState({ loadingAssign: false });
      })
      .catch(() => {
        message.error(
          this.props.intl.formatMessage({
            id: 'cannot_reserve_company',
            defaultMessage: 'You cannot reserve the campaign at the moment',
          }),
        );
        this.setState({ loadingAssign: false });
      });
  };

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
      match,
      history,
      isModal,
    } = this.props;

    const { loadingAssign } = this.state;
    const taggedObjects = [];
    const linkedObjects = [];
    const authorName = get(post, ['guestInfo', 'userId'], '') || post.author;
    const imagesArraySize = size(this.images);

    forEach(post.wobjects, wobj => {
      if (wobj.tagged) taggedObjects.push(wobj);
      else linkedObjects.push(wobj);
    });
    const { open, index } = this.state.lightbox;
    const getImagePath = item =>
      item.includes('waivio.nyc3.digitaloceanspaces') ? item : getImagePathPost(item);
    const parsedBody = getHtml(post.body, {}, 'text');

    this.images = extractImageTags(parsedBody).map(image => ({
      ...image,
      src: getImagePath(image.src),
    }));
    const body = this.images.reduce(
      (acc, item) => acc.replace(`<center>${item.alt}</center>`, ''),
      post.body,
    );
    let signedBody = body;

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
            imageTitle={this.images[index].alt}
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

        <Collapse defaultActiveKey={['1']} accordion>
          {!isEmpty(linkedObjects) && (
            <Collapse.Panel
              header={`${intl.formatMessage({
                id: 'editor_linked_objects',
                defaultMessage: 'Linked objects',
              })} ${linkedObjects.length}`}
              key="1"
            >
              {map(linkedObjects, obj => {
                if (obj.campaigns) {
                  const minReward = get(obj, ['campaigns', 'min_reward']);
                  const rewardPricePassed = minReward ? `${minReward.toFixed(2)} USD` : '';
                  const maxReward = get(obj, ['campaigns', 'max_reward']);
                  const rewardMaxPassed =
                    maxReward !== minReward ? `${maxReward.toFixed(2)} USD` : '';

                  return (
                    <Campaign
                      proposition={obj}
                      filterKey={'all'}
                      key={obj.id}
                      passedParent={obj.parent}
                      userName={user.name}
                      rewardPricePassed={!rewardMaxPassed ? rewardPricePassed : null}
                      rewardMaxPassed={rewardMaxPassed || null}
                    />
                  );
                }

                if (obj.propositions) {
                  return !isEmpty(obj.propositions)
                    ? obj.propositions.map(proposition => (
                        <Proposition
                          guide={proposition.guide}
                          proposition={proposition}
                          wobj={obj}
                          assignCommentPermlink={obj.permlink}
                          assignProposition={this.assignPropositionHandler}
                          authorizedUserName={user.name}
                          loading={loadingAssign}
                          key={obj.author_permlink}
                          match={match}
                          user={user}
                          history={history}
                        />
                      ))
                    : null;
                }

                return (
                  <div className="CardView">
                    <ObjectCardView key={obj.id} wObject={obj} passedParent={obj.parent} />
                  </div>
                );
              })}
            </Collapse.Panel>
          )}
          {!isEmpty(taggedObjects) && (
            <Collapse.Panel
              header={`${intl.formatMessage({
                id: 'objects_related_by_tags',
                defaultMessage: 'Objects related by #tags',
              })} ${taggedObjects.length}`}
              key="2"
            >
              {map(taggedObjects, obj => {
                const wobj = obj;

                return <ObjectCardView key={`${wobj.id}`} wObject={wobj} />;
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
          onLikeClick={onLikeClick}
          onShareClick={onShareClick}
          onEditClick={onEditClick}
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
