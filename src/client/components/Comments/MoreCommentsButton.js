import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import './MoreCommentsButton.less';

const MoreCommentsButton = ({ comments, visibleComments, isQuickComments, onClick }) => {
  if (comments === 0 || visibleComments >= comments) {
    return null;
  }
  return (
    <button
      className={classNames('MoreCommentsButton', { 'quick-comments': isQuickComments })}
      onClick={onClick}
    >
      <span className="MoreCommentsButton__text">
        <FormattedMessage id="show_more_comments" defaultMessage="Show more comments" />
        {!isQuickComments && <span>&nbsp;({comments - visibleComments})</span>}
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
