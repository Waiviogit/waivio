import React from 'react';
import PropTypes from 'prop-types';
import { useSelected, useFocused } from 'slate-react';
import getSource, { getIframeContainerClass, isOdysee } from '../../util/videoHelper';
import AsyncVideo from '../../../../vendor/asyncVideo';

import './video.less';

const Video = ({ url, children }) => {
  if (isOdysee(url)) {
    return <AsyncVideo url={url} />;
  }
  const src = getSource({ src: url });
  const selected = useSelected();
  const focused = useFocused();

  if (src) {
    return (
      <div
        style={{ boxShadow: selected && focused && '0 0 3px 3px lightgray', textAlign: 'center' }}
        className={getIframeContainerClass({ url }, true)}
      >
        <iframe
          title={src}
          width="100%"
          height={400}
          className="video-iframe"
          src={src}
          frameBorder="0"
          allowFullScreen
        />
        <span style={{ display: 'none' }}>{children}</span>
      </div>
    );
  }

  return <div className="invalidVideoSrc">invalid video source</div>;
};

Video.propTypes = {
  url: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Video;
