import React, { useEffect, useState } from 'react';
import { getOdyseeLink } from '../components/EditorExtended/util/videoHelper';
import PropTypes from 'prop-types';

const AsyncVideo = ({ url }) => {
  const [src, setSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getVideo = async () => {
      try {
        setIsLoading(true);
        const _url = await getOdyseeLink(url);
        setSrc(_url);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    getVideo();
  }, [url]);

  return (
    <div className="PostFeedEmbed__container">
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
};

export default AsyncVideo;

AsyncVideo.propTypes = {
  url: PropTypes.string.isRequired,
};

AsyncVideo.defaultProps = {
  url: '',
};
