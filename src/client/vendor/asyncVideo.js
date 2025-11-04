import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getOdyseeLink } from '../components/EditorExtended/util/videoHelper';

const AsyncVideo = ({ url }) => {
  const src = useMemo(() => (url ? getOdyseeLink(url) : ''), [url]);

  if (!src) return null;

  return (
    <div className="PostFeedEmbed__container">
      <iframe
        title="Odysee video"
        className="video-iframe"
        style={{ width: '100%', aspectRatio: '16 / 9', marginBottom: '5px' }}
        src={src}
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
};

AsyncVideo.propTypes = { url: PropTypes.string.isRequired };
export default AsyncVideo;
