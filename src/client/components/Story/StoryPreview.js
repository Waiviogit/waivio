import React from 'react';
import PropTypes from 'prop-types';
import { get, has } from 'lodash';
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

const StoryPreview = ({ post }) => {
  if (!post) return '';
  const jsonMetadata = jsonParse(post.json_metadata);
  let imagePath = '';

  if (jsonMetadata) {
    if (jsonMetadata.image && jsonMetadata.image[0]) {
      imagePath = getProxyImageURL(jsonMetadata.image[0], 'preview');
    } else if (
      jsonMetadata.wobj &&
      jsonMetadata.wobj.field &&
      [objectFields.galleryItem, objectFields.avatar, objectFields.background].includes(
        jsonMetadata.wobj.field.name,
      )
    ) {
      imagePath = jsonMetadata.wobj.field.body;
    }
  } else {
    const contentImages = getContentImages(post.body);
    if (contentImages.length) {
      imagePath = getProxyImageURL(contentImages[0], 'preview');
    }
  }

  const embeds = steemEmbed.getAll(post.body, { height: '100%' });
  const video = jsonMetadata && jsonMetadata.video;
  let hasVideo = false;
  if (has(video, 'content.videohash') && has(video, 'info.snaphash')) {
    const author = get(video, 'info.author', '');
    const permlink = get(video, 'info.permlink', '');
    const dTubeEmbedUrl = `https://emb.d.tube/#!/${author}/${permlink}/true`;
    const dTubeIFrame = `<iframe width="100%" height="340" src="${dTubeEmbedUrl}" allowFullScreen></iframe>`;
    hasVideo = true;
    embeds[0] = {
      type: 'video',
      provider_name: 'DTube',
      embed: dTubeIFrame,
      thumbnail: getProxyImageURL(`https://ipfs.io/ipfs/${video.info.snaphash}`, 'preview'),
    };
  }

  const preview = {
    text: () => <BodyShort key="text" className="Story__content__body" body={post.body} />,

    embed: () => embeds && embeds[0] && <PostFeedEmbed key="embed" embed={embeds[0]} />,

    image: () => (
      <div key={imagePath} className="Story__content__img-container">
        <img alt="" src={imagePath} />
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
};

export default StoryPreview;
