import React from 'react';
import PropTypes from 'prop-types';
import { getTwitterShareURL } from '../../../common/helpers/socialProfiles';
import './ShareButton.less';

const TwitterShare = ({ url, text, hashtags }) => (
  <a
    className="ShareButton"
    href={getTwitterShareURL(text, url, hashtags)}
    rel="noopener noreferrer"
    target="_blank"
  >
    <div className="ShareButton__contents ShareButton__contents__twitter">
      <i className="iconfont icon-twitter ShareButton__icon" />
    </div>
  </a>
);

TwitterShare.propTypes = {
  url: PropTypes.string,
  text: PropTypes.string,
  hashtags: PropTypes.arrayOf(PropTypes.string),
};

TwitterShare.defaultProps = {
  url: '',
  text: '',
  hashtags: [],
};

export default TwitterShare;
