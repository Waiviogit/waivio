import React from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import VisibilitySensor from 'react-visibility-sensor';
import {
  dropCategory,
  isBannedPost,
  replaceBotWithGuestName,
} from '../../common/helpers/postHelpers';
import PostContent from './PostContent';
import Comments from '../comments/Comments';
import { getFacebookShareURL, getTwitterShareURL } from '../../common/helpers/socialProfiles';
import BBackTop from '../components/BBackTop';

import './PostModal.less';

class PostModal extends React.Component {
  static propTypes = {
    showPostModal: PropTypes.bool.isRequired,
    hidePostModal: PropTypes.func.isRequired,
    currentShownPost: PropTypes.shape(),
    shownPostContents: PropTypes.shape(),
    author: PropTypes.shape(),
    isGuest: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    mainColor: PropTypes.string.isRequired,
    getSocialInfoPost: PropTypes.func,
  };

  static defaultProps = {
    currentShownPost: {},
    shownPostContents: {},
    author: {},
    getSocialInfoPost: () => {},
  };

  static pushURLState(title, url) {
    if (window) window.history.pushState({}, title, url);
  }

  static findScrollElement() {
    return document.querySelector('.PostModal');
  }

  constructor(props) {
    super(props);

    const previousURL = window ? window.location.href : '';

    this.state = {
      commentsVisible: false,
      previousURL,
    };

    this.handleCommentsVisibility = this.handleCommentsVisibility.bind(this);
    this.handleHidePostModal = this.handleHidePostModal.bind(this);
  }

  componentDidMount() {
    if (typeof document !== 'undefined') {
      const modalContents = document.getElementsByClassName('ant-modal-wrap');
      const modalContentElement = get(modalContents, 0);

      if (modalContentElement) {
        modalContentElement.scrollTop = 0;
      }

      document.body.classList.add('post-modal');
    }
    const { currentShownPost } = this.props;
    const { title, author, guestInfo } = currentShownPost;
    const authorName = get(currentShownPost, ['guestInfo', 'userId'], '') || author;
    const permlink = get(currentShownPost, 'permlink', '');
    const rootPermlink = get(currentShownPost, 'root_permlink', '');
    const userPostURL = `@${author}/${permlink}`;
    const guestUserPostURL = `@${authorName}/${permlink}`;
    const postURL = isEmpty(guestInfo) ? userPostURL : guestUserPostURL;
    const baseURL = window ? window.location.origin : 'https://waivio.com';

    PostModal.pushURLState(title, `${baseURL}/${postURL}`);
    if (permlink === rootPermlink) {
      this.props.getSocialInfoPost(authorName, permlink);
    }
  }

  componentWillUnmount() {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('post-modal');
    }

    this.props.hidePostModal();
  }

  handleCommentsVisibility(visible) {
    if (visible) {
      this.setState({
        commentsVisible: true,
      });
    }
  }

  handleHidePostModal() {
    PostModal.pushURLState('', this.state.previousURL);
    this.props.hidePostModal();
  }

  handleShare = shareLink => {
    window.location.assign(shareLink);
  };

  render() {
    const {
      showPostModal,
      currentShownPost,
      author: authorDetails,
      shownPostContents,
      isGuest,
      username,
      mainColor,
    } = this.props;
    const { permlink, title, url } = currentShownPost;
    const { tags, cities, userTwitter, wobjectsTwitter } = shownPostContents;
    const author = currentShownPost.guestInfo
      ? currentShownPost.guestInfo.userId
      : currentShownPost.author;
    const postName = !isGuest && username ? `?ref=${username}` : '';
    const baseURL = window ? window.location.origin : 'https://waivio.com';
    const postURL = `${baseURL}${replaceBotWithGuestName(
      dropCategory(url),
      currentShownPost.guestInfo,
    )}${postName}`;
    const hashtags = !isEmpty(tags) || !isEmpty(cities) ? [...tags, ...cities] : [];
    const authorTwitter = !isEmpty(userTwitter) ? `by @${userTwitter}` : `by ${author}`;
    const objectTwitter = !isEmpty(wobjectsTwitter) ? `@${wobjectsTwitter}` : '';
    const shareTextSocialTwitter = `"${encodeURIComponent(
      title,
    )}" ${authorTwitter} ${objectTwitter}`;

    const twitterShareURL = getTwitterShareURL(shareTextSocialTwitter, postURL, hashtags);

    const facebookShareURL = getFacebookShareURL(postURL);
    const signature = get(authorDetails, 'posting_json_metadata.profile.signature', null);
    const isModal = !isEmpty(currentShownPost);

    return (
      <Modal
        title={null}
        footer={null}
        visible={showPostModal}
        onCancel={this.handleHidePostModal}
        width={767}
        wrapClassName={classNames('PostModal', { PostModal__hidden: !showPostModal })}
        destroyOnClose
        style={{ '--website-color': `${mainColor}` }}
      >
        <BBackTop isModal target={PostModal.findScrollElement} />
        <div className="PostModal__back">
          <a
            className="PostModal__back__link"
            role="presentation"
            onClick={this.handleHidePostModal}
          >
            <i className="iconfont icon-return" />
            <FormattedMessage id="back" defaultMessage="Back" />
          </a>
        </div>
        <div className="PostModal__actions-container">
          <a role="presentation" onClick={this.handleHidePostModal} className="PostModal__action">
            <i className="iconfont icon-close PostModal__icon" />
          </a>
          <Link replace to={`/@${author}/${permlink}`} className="PostModal__action">
            <i className="iconfont icon-send PostModal__icon" />
          </Link>
          <a
            role="presentation"
            key="share-twitter"
            rel="noopener noreferrer"
            target="_blank"
            className="PostModal__action"
            onClick={e => {
              e.preventDefault();
              this.handleShare(twitterShareURL);
            }}
          >
            <i className="iconfont icon-twitter PostModal__icon" />
          </a>
          <a
            role="presentation"
            key="share-facebook"
            rel="noopener noreferrer"
            target="_blank"
            className="PostModal__action"
            onClick={e => {
              e.preventDefault();
              this.handleShare(facebookShareURL);
            }}
          >
            <i className="iconfont icon-facebook PostModal__icon" />
          </a>
        </div>
        <PostContent content={shownPostContents} signature={signature} isModal={isModal} />
        <VisibilitySensor onChange={this.handleCommentsVisibility}>
          {!isBannedPost(shownPostContents) && (
            <div id="comments">
              <Comments show={this.state.commentsVisible} post={shownPostContents} />
            </div>
          )}
        </VisibilitySensor>
      </Modal>
    );
  }
}

export default PostModal;
