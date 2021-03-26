import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isPostVideo } from './StoryHelper';
import './PostFeedEmbed.less';

export default class PostFeedEmbed extends React.Component {
  static propTypes = {
    embed: PropTypes.shape({
      provider_name: PropTypes.string,
      thumbnail: PropTypes.string,
      embed: PropTypes.string,
    }).isRequired,
    inPost: PropTypes.bool,
    isModal: PropTypes.bool,
    is3Speak: PropTypes.bool,
    isPostPreviewModal: PropTypes.bool,
    isFullStory: PropTypes.bool,
    isGuest: PropTypes.bool,
  };

  static defaultProps = {
    inPost: false,
    isModal: false,
    is3Speak: false,
    isPostPreviewModal: false,
    isFullStory: false,
    isGuest: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      showIframe: false,
    };
  }

  handleThumbClick = e => {
    e.preventDefault();
    this.setState({ showIframe: true });
  };

  renderWithIframe = (
    embed,
    isModal,
    is3Speak,
    isVimeo,
    isPostPreviewModal,
    isFullStory,
    isGuest,
  ) => {
    const postFeedEmbedClassList = classNames('PostFeedEmbed__container', {
      'PostFeedEmbed__container-3speak': isModal && is3Speak,
      'PostFeedEmbed__container-vimeo': isVimeo && !isPostPreviewModal,
      'PostFeedEmbed__container-post-preview': isPostPreviewModal,
      'PostFeedEmbed__container-vimeo-story-full': isVimeo && isFullStory,
      'PostFeedEmbed__container-vimeo-story-full-guestPost': isVimeo && isFullStory && isGuest,
    });
    return (
      // eslint-disable-next-line react/no-danger
      <div className={postFeedEmbedClassList} dangerouslySetInnerHTML={{ __html: embed }} />
    );
  };

  renderThumbFirst(thumb) {
    return (
      <div role="presentation" className="PostFeedEmbed" onClick={this.handleThumbClick}>
        <div className="PostFeedEmbed__playButton">
          <i className="iconfont icon-group icon-playon_fill" />
        </div>
        <img alt="thumbnail" className="PostFeedEmbed__preview" src={thumb} />
      </div>
    );
  }

  render() {
    const {
      embed,
      inPost,
      isModal,
      is3Speak,
      isPostPreviewModal,
      isFullStory,
      isGuest,
    } = this.props;
    const shouldRenderThumb = inPost ? false : !this.state.showIframe;
    if (isPostVideo(embed.provider_name, shouldRenderThumb)) {
      return this.renderThumbFirst(embed.thumbnail);
    } else if (embed.embed) {
      const isVimeo = embed.provider_name === 'Vimeo';
      return this.renderWithIframe(
        embed.embed,
        isModal,
        is3Speak,
        isVimeo,
        isPostPreviewModal,
        isFullStory,
        isGuest,
      );
    }
    return <div />;
  }
}
