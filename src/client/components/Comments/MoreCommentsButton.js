import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import './MoreCommentsButton.less';

const MoreCommentsButton = ({ comments, visibleComments, isQuickComments, onClick }) => {
  if (comments === 0 || visibleComments >= comments) {
    return null;
  }
  return (
    <button className="MoreCommentsButton" onClick={onClick}>
      <span className="MoreCommentsButton__text">
        <FormattedMessage
          id="comment_show_more"
          defaultMessage="Show more comments ({count})"
          values={{
            count: comments - visibleComments,
          }}
        />
      </span>
      <Icon type={isQuickComments ? 'up' : 'down'} />
    </button>
  );
};

MoreCommentsButton.propTypes = {
  comments: PropTypes.number.isRequired,
  visibleComments: PropTypes.number.isRequired,
  isQuickComments: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MoreCommentsButton;
