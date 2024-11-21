import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AsyncVideo from '../../vendor/asyncVideo';
import { getIframeContainerClass } from '../EditorExtended/util/videoHelper';
import { isPostVideo } from './StoryHelper';

import './PostFeedEmbed.less';

export default class PostFeedEmbed extends React.Component {
  static propTypes = {
    embed: PropTypes.shape({
      provider_name: PropTypes.string,
      thumbnail: PropTypes.string,
      embed: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
    inPost: PropTypes.bool,
    isPreview: PropTypes.bool,
    isSocial: PropTypes.bool,
  };

  static defaultProps = {
    inPost: false,
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

  renderWithIframe = embed => {
    const postFeedEmbedClassList = getIframeContainerClass(this.props.embed, this.props.inPost);

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
        <img
          alt="thumbnail"
          className={classNames('PostFeedEmbed__preview', {
            'PostFeedEmbed__preview--thin':
              (this.props.embed.provider_name === 'TikTok' ||
                this.props.embed.url.includes('shorts')) &&
              this.props.inPost,
          })}
          src={thumb}
        />
      </div>
    );
  }

  render() {
    const { embed, inPost, isSocial, isPreview } = this.props;
    const shouldRenderThumb =
      inPost && !isPreview && !embed.url.includes('tiktok') ? false : !this.state.showIframe;

    if (embed?.url?.includes('odysee.com/')) {
      return <AsyncVideo url={embed.url} />;
    }

    if (
      isPostVideo(embed.provider_name, shouldRenderThumb, isSocial) &&
      embed.thumbnail &&
      !embed.url.includes('shorts')
    ) {
      return this.renderThumbFirst(embed.thumbnail);
    } else if (embed.embed) {
      return this.renderWithIframe(embed.embed);
    }

    return <div />;
  }
}
