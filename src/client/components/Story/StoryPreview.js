import React from 'react';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { get, has } from 'lodash';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import steemEmbed from '../../vendor/embedMedia';
import PostFeedEmbed from './PostFeedEmbed';
import BodyShort from './BodyShort';
import { jsonParse } from '../../../common/helpers/formatter';
import { getImageForPreview } from '../../../common/helpers/postHelpers';
import {
  getPositions,
  isPostStartsWithAnEmbed,
  isPostStartsWithAPicture,
  isPostWithEmbedBeforeFirstHalf,
  isPostWithPictureBeforeFirstHalf,
  postWithAnEmbed,
  postWithPicture,
} from './StoryHelper';
import { getHtml } from './Body';
import { getImagePathPost, getProxyImageURL } from '../../../common/helpers/image';
import { getBodyLink } from '../EditorExtended/util/videoHelper';
import { videoPreviewRegex, videoPreviewRegex2 } from '../../../common/helpers/regexHelpers';
import { getTiktokPreviewFromState } from '../../../store/feedStore/feedSelectors';

const regexPattern = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|\.be\/)([\w-]+)(?:\S+)?/g;

const StoryPreview = ({ post, isUpdates, isVimeo }) => {
  const storyContentBodyClassList = classNames('Story__content__body', {
    'Story__content__body-vimeo': isVimeo,
  });
  const previews = useSelector(getTiktokPreviewFromState);

  if (!post) return '';
  const jsonMetadata = jsonParse(post.json_metadata);
  const image = getImageForPreview(post, isUpdates);
  const imagePath = typeof image === 'string' ? image : image[0];
  const embeds = steemEmbed.getAll(post.body, { height: '100%' });
  const video = jsonMetadata && jsonMetadata.video;

  if (has(video, 'content.videohash') && has(video, 'info.snaphash')) {
    const author = get(video, 'info.author', '');
    const permlink = get(video, 'info.permlink', '');
    const dTubeEmbedUrl = `https://emb.d.tube/#!/${author}/${permlink}/true`;
    const dTubeIFrame = `<iframe width="100%" height="340" src="${dTubeEmbedUrl}" allowFullScreen></iframe>`;

    embeds[0] = {
      type: 'video',
      provider_name: 'DTube',
      embed: dTubeIFrame,
      thumbnail: getProxyImageURL(`https://ipfs.io/ipfs/${video.info.snaphash}`, 'preview'),
    };
  }

  const videoPreviewResult =
    post.body.match(videoPreviewRegex2) || post.body.match(videoPreviewRegex);
  const videoPreviewResulYoutube = post.body.match(regexPattern);

  if (!embeds[0] && videoPreviewResult) {
    const videoLink = getBodyLink(videoPreviewResult);

    if (videoLink) {
      const options = {
        width: '100%',
        height: 340,
        autoplay: false,
        thumbnail: '',
      };
      let thumbnailID;

      if (video && video.files) {
        if (video.files.ipfs && video.files.ipfs.img) {
          thumbnailID = video.files.ipfs.img[360];
          options.thumbnail = thumbnailID && `https://ipfs.io/ipfs/${thumbnailID}`;
        } else {
          thumbnailID = video.files.youtube;
          options.thumbnail =
            thumbnailID && `https://img.youtube.com/vi/${thumbnailID}/hqdefault.jpg`;
        }
      }
      if (embeds[0]) {
        embeds[0] = steemEmbed.get(videoLink, options);
      }
    }
  }

  if (!embeds[0] && videoPreviewResulYoutube) {
    const videoLink = videoPreviewResulYoutube[0];

    if (videoLink) {
      const options = {
        width: '100%',
        height: 340,
        autoplay: false,
        thumbnail: '',
      };

      embeds[0] = steemEmbed.get(videoLink.replaceAll('\\', ''), options);
    }
  }
  const isTiktok = embeds[0]?.provider_name === 'TikTok';
  const embed = isTiktok
    ? { ...embeds?.[0], thumbnail: previews?.find(i => i.url === embeds?.[0]?.url)?.urlPreview }
    : embeds?.[0];

  const hasVideo = embeds && embeds[0];
  const preview = {
    text: () => (
      <BodyShort
        key="text"
        className={storyContentBodyClassList}
        body={post.fullBody || post.body}
      />
    ),

    embed: () => {
      if (embeds && embed) {
        if (embed?.type === 'music') {
          const iframeRegex = /<iframe[^>]*src="([^"]*)"[^>]*><\/iframe>/g;

          const extractIframe = body => {
            const matches = body.match(iframeRegex);

            return matches ? matches[0] : null;
          };

          const iframe = extractIframe(post.fullBody || post.body);

          return <div dangerouslySetInnerHTML={{ __html: iframe }} />;
        }

        return <PostFeedEmbed isPreview inPost key="embed" embed={embed} />;
      }

      return null;
    },
    image: () =>
      imagePath && (
        <div key={imagePath} className="Story__content__img-container">
          <LazyLoadImage src={getImagePathPost(imagePath)} threshold={250} />
        </div>
      ),
  };

  const htmlBody = getHtml(post.body, {}, 'Object');
  const tagPositions = getPositions(htmlBody);
  const bodyData = [];

  if (isUpdates) {
    bodyData.push(preview.text());
    bodyData.push(preview.image());
  } else if (htmlBody.length <= 1500 && postWithPicture(tagPositions, 100)) {
    bodyData.push(preview.image());
    bodyData.push(preview.text());
  } else if (htmlBody.length <= 1500 && postWithAnEmbed(tagPositions, 100)) {
    bodyData.push(preview.embed());
    bodyData.push(preview.text());
  } else if (isPostStartsWithAPicture(tagPositions)) {
    bodyData.push(preview.image());
    bodyData.push(preview.text());
  } else if (isPostStartsWithAnEmbed(tagPositions)) {
    bodyData.push(preview.embed());
    bodyData.push(preview.text());
  } else if (isPostWithPictureBeforeFirstHalf(tagPositions)) {
    bodyData.push(preview.text());
    bodyData.push(preview.image());
  } else if (isPostWithEmbedBeforeFirstHalf(tagPositions)) {
    bodyData.push(preview.text());
    bodyData.push(preview.embed());
  } else if (hasVideo) {
    bodyData.push(preview.embed());
    bodyData.push(preview.text());
  } else if (imagePath !== '') {
    bodyData.push(preview.image());
    bodyData.push(preview.text());
  } else {
    bodyData.push(preview.text());
  }

  return <div>{bodyData}</div>;
};

StoryPreview.propTypes = {
  post: PropTypes.shape().isRequired,
  isUpdates: PropTypes.bool,
  isVimeo: PropTypes.bool,
};

StoryPreview.defaultProps = {
  isUpdates: false,
  isVimeo: false,
};

export default StoryPreview;
