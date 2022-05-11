import React from 'react';
import PropTypes from 'prop-types';
import getSource, { getIframeContainerClass, isOdysee } from '../../util/videoHelper';
import AsyncVideo from '../../../../vendor/asyncVideo';

import './video.less';

const Video = ({ entityData }) => {
  if (isOdysee(entityData.src)) {
    return <AsyncVideo url={entityData.src} />;
  }
  const src = getSource(entityData);

  if (src) {
    return (
      <div className={getIframeContainerClass({ url: entityData.src })}>
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
  entityData: PropTypes.shape(undefined).isRequired,
};

export default Video;
