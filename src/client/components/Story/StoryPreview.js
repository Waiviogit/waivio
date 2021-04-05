import React from 'react';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { get, has, isEmpty } from 'lodash';
import classNames from 'classnames';
import steemEmbed from '../../vendor/embedMedia';
import PostFeedEmbed from './PostFeedEmbed';
import BodyShort from './BodyShort';
import { jsonParse } from '../../helpers/formatter';
import { getContentImages } from '../../helpers/postHelpers';
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
import { getProxyImageURL } from '../../helpers/image';
import { objectFields } from '../../../common/constants/listOfFields';
import { getBodyLink } from '../EditorExtended/util/videoHelper';
import { videoPreviewRegex } from '../../helpers/regexHelpers';

const StoryPreview = ({ post, isUpdates, isVimeo }) => {
  const storyContentBodyClassList = classNames('Story__content__body', {
    'Story__content__body-vimeo': isVimeo,
  });

  if (!post) return '';
  const jsonMetadata = jsonParse(post.json_metadata);
  const field = get(jsonMetadata, ['wobj', 'field'], {});
  let imagePath = '';

  if (
    !isEmpty(jsonMetadata) &&
    !isEmpty(jsonMetadata.image) &&
    jsonMetadata.image[0].includes('waivio.nyc3.digitaloceanspaces')
  ) {
    imagePath = jsonMetadata.image[0];
  } else if (jsonMetadata && jsonMetadata.image && jsonMetadata.image[0]) {
    imagePath = getProxyImageURL(jsonMetadata.image[0], 'preview');
  } else if (
    [objectFields.galleryItem, objectFields.avatar, objectFields.background].includes(field.name)
  ) {
    imagePath = getProxyImageURL(jsonMetadata.wobj.field.body, 'preview');
  } else {
    const contentImages = getContentImages(post.body);

    if (contentImages.length) {
      imagePath = getProxyImageURL(contentImages[0], 'preview');
    }
  }

  if (
    isUpdates &&
    (post.name === objectFields.avatar ||
      post.name === objectFields.galleryItem ||
      post.name === objectFields.background)
  ) {
    if (!isEmpty(post.body) && post.body.includes('waivio.nyc3.digitaloceanspaces')) {
      imagePath = post.body;
    } else {
      imagePath = getProxyImageURL(post.body, 'preview');
    }
  }

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

  const videoPreviewResult = post.body.match(videoPreviewRegex);

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
          options.thumbnail = thumbnailID && `https://img.youtube.com/vi/${thumbnailID}/0.jpg`;
        }
      }

      embeds[0] = steemEmbed.get(videoLink, options);
      embeds[0].thumbnail = getProxyImageURL(embeds[0].thumbnail, 'preview');
    }
  }
  const hasVideo = embeds && embeds[0] && true;
  const preview = {
    text: () => (
      <BodyShort
        key="text"
        className={storyContentBodyClassList}
        body={post.fullBody || post.body}
      />
    ),

    embed: () => embeds && embeds[0] && <PostFeedEmbed key="embed" embed={embeds[0]} />,
    image: () => (
      <div key={imagePath} className="Story__content__img-container">
        <LazyLoadImage src={imagePath} threshold={250} />
      </div>
    ),
  };

  const htmlBody = getHtml(post.body, {}, 'text');
  const tagPositions = getPositions(htmlBody);
  const bodyData = [];

  if (hasVideo) {
    bodyData.push(preview.embed());
    bodyData.push(preview.text());
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
  } else if (imagePath !== '') {
    bodyData.push(preview.text());
    bodyData.push(preview.image());
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
