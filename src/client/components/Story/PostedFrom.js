import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import BTooltip from '../BTooltip';
import { getAppData } from '../../../common/helpers/postHelpers';
import './PostedFrom.less';

const PostedFrom = ({ post, isThread }) => {
  const { appName, version } = getAppData(post);

  if (!appName || isThread) {
    return null;
  }

  return (
    <span className="PostedFrom">
      <span className="PostedFrom__bullet" />
      <BTooltip
        title={
          version && (
            <span>
              <FormattedMessage
                id="posted_from_tooltip"
                defaultMessage={'Version: {version}'}
                values={{ version }}
              />
            </span>
          )
        }
      >
        <span className="PostedFrom__text">{appName}</span>
      </BTooltip>
    </span>
  );
};

PostedFrom.propTypes = {
  post: PropTypes.shape().isRequired,
  isThread: PropTypes.bool,
};

export default PostedFrom;
