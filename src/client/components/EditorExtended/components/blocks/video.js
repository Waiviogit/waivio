import React from 'react';
import PropTypes from 'prop-types';
import getSource from '../../util/videoHelper';
import './video.less';

const Video = ({ entityData }) => {
  const src = getSource(entityData);
  if (src) {
    return (
      <div className="md-block-atomic-embed">
        <div>
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
      </div>
    );
  }

  return <div className="invalidVideoSrc">invalid video source</div>;
};

Video.propTypes = {
  entityData: PropTypes.shape().isRequired,
};

export default Video;
