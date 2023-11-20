import React from 'react';
import PropTypes from 'prop-types';
import getSource, { getIframeContainerClass, isOdysee } from '../../util/videoHelper';
import AsyncVideo from '../../../../vendor/asyncVideo';

import './video.less';

const Video = ({ url }) => {
  if (isOdysee(url)) {
    return <AsyncVideo url={url} />;
  }
  const src = getSource({ src: url });

  if (src) {
    return (
      <div className={getIframeContainerClass({ url })}>
        <iframe
          title={src}
          width="100%"
          height={400}
          className="video-iframe"
          src={src}
          frameBorder="0"
          allowFullScreen
        />
      </div>
    );
  }

  return <div className="invalidVideoSrc">invalid video source</div>;
};

Video.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Video;
