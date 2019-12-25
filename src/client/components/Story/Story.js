import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage,
  FormattedRelative,
  FormattedDate,
  FormattedTime,
} from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { Tag } from 'antd';
import VisibilitySensor from 'react-visibility-sensor';
import formatter from '../../helpers/steemitFormatter';
import { getForecastData } from '../../helpers/forecastHelper';
import {
  isPostDeleted,
  isPostTaggedNSFW,
  dropCategory,
  isBannedPost,
} from '../../helpers/postHelpers';
import withAuthActions from '../../auth/withAuthActions';
import BTooltip from '../BTooltip';
import StoryPreview from './StoryPreview';
import StoryFooter from '../StoryFooter/StoryFooter';
import Avatar from '../Avatar';
import NSFWStoryPreviewMessage from './NSFWStoryPreviewMessage';
import HiddenStoryPreviewMessage from './HiddenStoryPreviewMessage';
import DMCARemovedMessage from './DMCARemovedMessage';
import PostChart from '../../../investarena/components/PostChart';
import PostQuotation from '../../../investarena/components/PostQuotation';
import PostSellBuy from '../../../investarena/components/PostSellBuy';
import PostForecast from '../../../investarena/components/PostForecast';
import ObjectAvatar from '../ObjectAvatar';
import PostedFrom from './PostedFrom';
import WeightTag from '../WeightTag';
import { calculateApprovePercent } from '../../helpers/wObjectHelper';
import './Story.less';

@injectIntl
@withRouter
@withAuthActions
class Story extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    defaultVotePercent: PropTypes.number,
    postState: PropTypes.shape(),
    match: PropTypes.shape(),
    user: PropTypes.shape(),
    showNSFWPosts: PropTypes.bool,
    pendingLike: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingBookmark: PropTypes.bool,
    saving: PropTypes.bool,
    ownPost: PropTypes.bool,
    singlePostVew: PropTypes.bool,
    sliderMode: PropTypes.bool,
    history: PropTypes.shape(),
    showPostModal: PropTypes.func,
    votePost: PropTypes.func,
    toggleBookmark: PropTypes.func,
    reblog: PropTypes.func,
    editPost: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    push: PropTypes.func,
  };

  static defaultProps = {
    pendingLike: false,
    pendingFollow: false,
    pendingBookmark: false,
    saving: false,
    ownPost: false,
    singlePostVew: false,
    sliderMode: false,
    showNSFWPosts: false,
    history: {},
    user: {},
    postState: {},
    rewardFund: {},
    post: {},
    defaultVotePercent: 100,
    match: { params: {} },
    showPostModal: () => {},
    votePost: () => {},
    toggleBookmark: () => {},
    reblog: () => {},
    editPost: () => {},
    followUser: () => {},
    unfollowUser: () => {},
    push: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      showHiddenStoryPreview: false,
      displayLoginModal: false,
      isQuoteValid: true,
      isVisible: false,
    };

    this.getDisplayStoryPreview = this.getDisplayStoryPreview.bind(this);
    this.handlePostPopoverMenuClick = this.handlePostPopoverMenuClick.bind(this);
    this.handleShowStoryPreview = this.handleShowStoryPreview.bind(this);
    this.handlePostModalDisplay = this.handlePostModalDisplay.bind(this);
    this.handlePreviewClickPostModalDisplay = this.handlePreviewClickPostModalDisplay.bind(this);
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleReportClick = this.handleReportClick.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleFollowClick = this.handleFollowClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
  }

  getApprovalTagLayout = () => {
    const percent = calculateApprovePercent(this.props.post.active_votes);
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <Tag>
          <span>
            {this.props.intl.formatMessage({
              id: 'approval',
              defaultMessage: 'Approval',
            })}
            <span className={`CalculatedPercent-${percent >= 70 ? 'green' : 'red'}`}>
              {` ${percent.toFixed(2)}%`}
            </span>
          </span>
        </Tag>
        {this.props.post.upvotedByModerator ? (
          <span className="Story__approvedByAdmin">
            {formatMessage({ id: 'approved_by_admin', defaultMessage: 'Approved by admin' })}
          </span>
        ) : (
          <span className="MinPercent">
            {formatMessage({ id: 'min_70_is_required', defaultMessage: 'Min 70% is required' })}
          </span>
        )}
      </React.Fragment>
    );
  };

  getDisplayStoryPreview() {
    const { post, showNSFWPosts } = this.props;
    const { showHiddenStoryPreview } = this.state;
    const postAuthorReputation = formatter.reputation(post.author_reputation);

    if (showHiddenStoryPreview) return true;

    if (postAuthorReputation >= 0 && isPostTaggedNSFW(post)) {
      return showNSFWPosts;
    } else if (postAuthorReputation < 0) {
      return false;
    }

    return true;
  }

  getObjectLayout = wobj => {
    const pathName = `/object/${wobj.author_permlink}`;
    let name = '';
    if (wobj.objectName) {
      name = wobj.objectName;
    } else {
      const nameFields = _.filter(wobj.fields, o => o.name === 'name');
      const nameField = _.maxBy(nameFields, 'weight') || {
        body: wobj.default_name,
      };
      if (nameField) name = nameField.body;
    }
    return (
      <Link
        key={wobj.author_permlink}
        to={{ pathname: pathName }}
        title={`${this.props.intl.formatMessage({
          id: 'related_to_object',
          defaultMessage: 'Related to topic',
        })} ${name} ${wobj.percent ? `(${wobj.percent.toFixed(2)}%)` : ''}`}
      >
        <ObjectAvatar item={wobj} size={40} />
      </Link>
    );
  };
  getWobjects = wobjects => {
    let i = 0;
    let objectFromCurrentPage = null;
    const returnData = _.map(wobjects, wobj => {
      if (wobj.author_permlink === this.props.match.params.name) {
        objectFromCurrentPage = this.getObjectLayout(wobj);
        return null;
      }
      if (i < 4) {
        i += 1;
        return this.getObjectLayout(wobj);
      }
      return null;
    });
    if (objectFromCurrentPage) {
      returnData.unshift(objectFromCurrentPage);
      if (i === 4) returnData.splice(-1, 1);
    }
    return returnData;
  };

  getWeighForUpdates = weight => {
    if (this.props.post.append_field_name) {
      if (weight > 9998) return weight - 1;
      return weight + 1;
    }
    return weight;
  };

  handleChangeVisibility = isVisible => this.setState({ isVisible });

  handleLikeClick(post, postState, weight = 10000) {
    const { sliderMode, defaultVotePercent } = this.props;
    const author = post.author_original || post.author;

    if (sliderMode) {
      this.props.votePost(post.id, author, post.permlink, weight);
    } else if (postState.isLiked) {
      this.props.votePost(post.id, author, post.permlink, 0);
    } else {
      this.props.votePost(post.id, author, post.permlink, defaultVotePercent);
    }
  }

  handleReportClick(post, postState, isRejectField) {
    let weight = postState.isReported ? 0 : -10000;
    if (isRejectField) {
      weight = postState.isReported ? 0 : 9999;
    }
    const author = post.author_original || post.author;
    this.props.votePost(post.id, author, post.permlink, weight);
  }

  handleShareClick(post) {
    this.props.reblog(post.id);
  }

  handleFollowClick(post) {
    const { userFollowed } = this.props.postState;
    if (userFollowed) {
      this.props.unfollowUser(post.author);
    } else {
      this.props.followUser(post.author);
    }
  }

  handleEditClick(post) {
    const { intl } = this.props;
    if (post.depth === 0) return this.props.editPost(post, intl);
    return this.props.push(`${post.url}-edit`);
  }

  clickMenuItem(key) {
    const { post, postState } = this.props;
    switch (key) {
      case 'follow':
        this.handleFollowClick(post);
        break;
      case 'save':
        this.props.toggleBookmark(post.id, post.author_original || post.author, post.permlink);
        break;
      case 'report':
        this.handleReportClick(post, postState);
        break;
      case 'edit':
        this.handleEditClick(post);
        break;
      default:
    }
  }

  handlePostPopoverMenuClick(key) {
    this.props.onActionInitiated(this.clickMenuItem.bind(this, key));
  }

  handleShowStoryPreview() {
    this.setState({
      showHiddenStoryPreview: true,
    });
  }

  handlePostModalDisplay(e) {
    e.preventDefault();
    const { post } = this.props;
    const isReplyPreview = _.isEmpty(post.title) || post.title !== post.root_title;
    const openInNewTab = _.get(e, 'metaKey', false) || _.get(e, 'ctrlKey', false);
    const postURL = dropCategory(post.url);

    if (isReplyPreview) {
      this.props.history.push(postURL);
    } else if (openInNewTab) {
      if (window) {
        const url = `${window.location.origin}${postURL}`;
        window.open(url);
      }
    } else {
      this.props.showPostModal(post);
    }
  }

  handlePreviewClickPostModalDisplay(e) {
    e.preventDefault();

    const { post } = this.props;
    const isReplyPreview = _.isEmpty(post.title) || post.title !== post.root_title;
    const elementNodeName = _.toLower(_.get(e, 'target.nodeName', ''));
    const elementClassName = _.get(e, 'target.className', '');
    const showPostModal =
      elementNodeName !== 'i' && elementClassName !== 'PostFeedEmbed__playButton';
    const openInNewTab = _.get(e, 'metaKey', false) || _.get(e, 'ctrlKey', false);
    const postURL = dropCategory(post.url);

    if (isReplyPreview) {
      this.props.history.push(postURL);
    } else if (openInNewTab && showPostModal) {
      if (window) {
        const url = `${window.location.origin}${postURL}`;
        window.open(url);
      }
    } else if (showPostModal) {
      this.props.showPostModal(post);
    }
  }

  renderStoryPreview() {
    const { post } = this.props;
    const showStoryPreview = this.getDisplayStoryPreview();
    const hiddenStoryPreviewMessage = isPostTaggedNSFW(post) ? (
      <NSFWStoryPreviewMessage onClick={this.handleShowStoryPreview} />
    ) : (
      <HiddenStoryPreviewMessage onClick={this.handleShowStoryPreview} />
    );

    if (isBannedPost(post)) {
      return <DMCARemovedMessage />;
    }

    return showStoryPreview ? (
      <a
        href={dropCategory(post.url)}
        rel="noopener noreferrer"
        target="_blank"
        onClick={this.handlePreviewClickPostModalDisplay}
        className="Story__content__preview"
      >
        <StoryPreview post={post} />
      </a>
    ) : (
      hiddenStoryPreviewMessage
    );
  }

  render() {
    const {
      // intl,
      user,
      post,
      postState,
      pendingLike,
      pendingFollow,
      pendingBookmark,
      saving,
      rewardFund,
      ownPost,
      singlePostVew,
      sliderMode,
      defaultVotePercent,
    } = this.props;
    const isEnoughData = !_.isEmpty(post) && !_.isEmpty(postState);
    const {
      predictedEndDate,
      quoteSecurity,
      postPrice,
      createdAt,
      buyOrSell,
      tpPrice,
      slPrice,
      isForecastExpired,
      // expiredBars,
      finalQuote,
      expiredAt,
      profitability,
      isForecastValid,
    } = getForecastData(post);
    let rebloggedUI = null;

    if (isEnoughData) {
      if (!post || isPostDeleted(post)) return <div />;

      if (post.reblogged_by && post.reblogged_by.length > 0) {
        rebloggedUI = (
          <div className="Story__reblog">
            <i className="iconfont icon-share1" />
            <FormattedMessage
              id="reblogged_username"
              defaultMessage="{username} reblogged"
              values={{
                username: (
                  <Link to={`/@${post.reblogged_by[0]}`}>
                    <span className="username">{post.reblogged_by[0]}</span>
                  </Link>
                ),
              }}
            />
          </div>
        );
      } else if (postState.isReblogged) {
        rebloggedUI = (
          <div className="Story__reblog">
            <i className="iconfont icon-share1" />
            <FormattedMessage id="reblogged" defaultMessage="Reblogged" />
          </div>
        );
      }
    }
    return isEnoughData ? (
      <VisibilitySensor
        offset={{top:-50, bottom: -50}}
        onChange={this.handleChangeVisibility}
        partialVisibility
      >
        <div className="Story" id={`${post.author}-${post.permlink}`}>
          {rebloggedUI}
          <div className="Story__content">
            <div className="Story__header">
              <Link to={`/@${post.author}`}>
                <Avatar username={post.author} size={40} />
              </Link>
              <div className="Story__header__text">
                <span className="Story__header__flex">
                  <h4>
                    <Link to={`/@${post.author}`}>
                      <span className="username">{post.author}</span>
                    </Link>
                  </h4>
                  <WeightTag weight={post.author_wobjects_weight} />
                </span>
                <span>
                  <BTooltip
                    title={
                      <span>
                        <FormattedDate value={`${post.created}Z`} />{' '}
                        <FormattedTime value={`${post.created}Z`} />
                      </span>
                    }
                  >
                    <span className="Story__date">
                      <FormattedRelative value={`${post.created}Z`} />
                    </span>
                  </BTooltip>
                  <PostedFrom post={post} />
                </span>
              </div>
              {this.state.isVisible && isForecastValid ? (
                <div className="Story__forecast">
                  <PostForecast
                    quoteSecurity={quoteSecurity}
                    postForecast={predictedEndDate}
                    isExpired={isForecastExpired}
                    expiredAt={expiredAt}
                  />
                </div>
              ) : (
                <div className="Story__topics">
                  <div className="Story__published">
                    <div className="PostWobject__wrap">
                      {post.wobjects && this.getWobjects(post.wobjects)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {this.state.isVisible && isForecastValid && (
              <PostSellBuy
                isExpired={isForecastExpired}
                finalQuote={finalQuote}
                quoteSecurity={quoteSecurity}
                postPrice={postPrice ? postPrice.toString() : 0}
                forecast={predictedEndDate}
                recommend={buyOrSell}
                profitability={profitability}
              />
            )}
            <div className="Story__content">
              <a
                href={dropCategory(post.url)}
                rel="noopener noreferrer"
                target="_blank"
                onClick={this.handlePostModalDisplay}
                className="Story__content__title"
              >
                <h2>
                  {post.append_field_name ? (
                    <React.Fragment>
                      <FormattedMessage
                        id={`object_field_${post.append_field_name}`}
                        defaultMessage={post.append_field_name}
                      />
                      {!_.isNil(post.append_field_weight) && this.getApprovalTagLayout()}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {post.depth !== 0 && <Tag color="#4f545c">RE</Tag>}
                      {post.title || post.root_title}
                    </React.Fragment>
                  )}
                </h2>
              </a>
              {this.renderStoryPreview()}
            </div>
            <div className="Story__footer">
              {this.state.isVisible && isForecastValid && (
                <PostChart
                  quoteSecurity={quoteSecurity}
                  createdAt={createdAt}
                  forecast={predictedEndDate}
                  recommend={buyOrSell}
                  toggleModalPost={() => {}}
                  tpPrice={tpPrice}
                  slPrice={slPrice}
                  expForecast={post.exp_forecast}
                  expiredAt={expiredAt}
                />
              )}
              {this.state.isVisible && isForecastValid && (
                <PostQuotation
                  quoteSecurity={quoteSecurity}
                  caller="od-pm"
                />
              )}
              <StoryFooter
                user={user}
                post={post}
                postState={postState}
                pendingLike={pendingLike}
                pendingFlag={pendingLike}
                rewardFund={rewardFund}
                ownPost={ownPost}
                singlePostVew={singlePostVew}
                sliderMode={sliderMode}
                defaultVotePercent={defaultVotePercent}
                onLikeClick={this.handleLikeClick}
                onReportClick={this.handleReportClick}
                onShareClick={this.handleShareClick}
                onEditClick={this.handleEditClick}
                pendingFollow={pendingFollow}
                pendingBookmark={pendingBookmark}
                saving={saving}
                handlePostPopoverMenuClick={this.handlePostPopoverMenuClick}
              />
            </div>
          </div>
        </div>
      </VisibilitySensor>
    ) : null;
  }
}

export default Story;
