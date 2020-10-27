import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import VisibilitySensor from 'react-visibility-sensor';
import {
  dropCategory,
  isBannedPost,
  replaceBotWithGuestName,
  getPostHashtags,
} from '../helpers/postHelpers';
import PostContent from './PostContent';
import Comments from '../comments/Comments';
import { getFacebookShareURL, getTwitterShareURL } from '../helpers/socialProfiles';
import BBackTop from '../components/BBackTop';
import './PostModal.less';

class PostModal extends React.Component {
  static propTypes = {
    showPostModal: PropTypes.bool.isRequired,
    hidePostModal: PropTypes.func.isRequired,
    currentShownPost: PropTypes.shape(),
    shownPostContents: PropTypes.shape(),
    author: PropTypes.shape(),
  };

  static defaultProps = {
    currentShownPost: {},
    shownPostContents: {},
    author: {},
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
    const { title, url } = currentShownPost;
    PostModal.pushURLState(
      title,
      replaceBotWithGuestName(dropCategory(url), currentShownPost.guestInfo),
    );
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

  render() {
    const {
      showPostModal,
      currentShownPost,
      author: authorDetails,
      shownPostContents,
    } = this.props;
    const { permlink, title, url, wobjects } = currentShownPost;
    const author = currentShownPost.guestInfo
      ? currentShownPost.guestInfo.userId
      : currentShownPost.author;
    const baseURL = window ? window.location.origin : 'https://waivio.com';
    const postURL = `${baseURL}${replaceBotWithGuestName(
      dropCategory(url),
      currentShownPost.guestInfo,
    )}`;
    const postHashtags = getPostHashtags(wobjects);
    const socialHashtags = [...postHashtags, 'waivio', 'hive'];
    const shareTextSocial = `"${encodeURIComponent(title)}" by @${author}`;

    const twitterShareURL = getTwitterShareURL(shareTextSocial, postURL, socialHashtags);
    const facebookShareURL = getFacebookShareURL(postURL);
    const signature = get(authorDetails, 'posting_json_metadata.profile.signature', null);

    return (
      <Modal
        title={null}
        footer={null}
        visible={showPostModal}
        onCancel={this.handleHidePostModal}
        width={767}
        wrapClassName={classNames('PostModal', { PostModal__hidden: !showPostModal })}
        destroyOnClose
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
            href={twitterShareURL}
            rel="noopener noreferrer"
            target="_blank"
            className="PostModal__action"
          >
            <i className="iconfont icon-twitter PostModal__icon" />
          </a>
          <a
            href={facebookShareURL}
            rel="noopener noreferrer"
            target="_blank"
            className="PostModal__action"
          >
            <i className="iconfont icon-facebook PostModal__icon" />
          </a>
        </div>
        <PostContent content={shownPostContents} signature={signature} />
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
