import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { getIsAuthenticated } from '../../../../store/authStore/authSelectors';

import './CategoryItemView.less';

const CategoryItemView = ({ wObject, intl, location, handleReportClick, isRejected }) => {
  const [rejected, setRejected] = useState(isRejected);
  const pathName = wObject.author_permlink;
  const isAuth = useSelector(getIsAuthenticated);
  const linkTo = location.hash === '' ? `#${pathName}` : `${location.hash}/${pathName}`;

  return (
    <div
      key={wObject.author_permlink}
      className="CategoryItemView"
      title={`${intl.formatMessage({
        id: 'GoTo',
        defaultMessage: 'Go to',
      })} ${wObject.name}`}
    >
      <div className="CategoryItemView__content">
        <Link
          key={wObject.author_permlink}
          to={linkTo}
          className="CategoryItemView__name-truncated"
          title={wObject.name}
        >
          <span>{wObject.name}</span>
          {!isNaN(wObject.listItemsCount) ? (
            <span className="items-count">&nbsp;({wObject.listItemsCount})</span>
          ) : null}
        </Link>
        {isAuth && (
          <span
            className={classNames({
              CategoryItemView__reject: !isRejected,
              CategoryItemView__rejected: isRejected,
            })}
            onClick={() => {
              if (!rejected)
                handleReportClick(wObject.author_permlink).then(() => setRejected(true));
            }}
          >
            ({rejected ? 'rejected' : 'reject'})
          </span>
        )}
      </div>
      <Link
        key={wObject.author_permlink}
        to={linkTo}
        className="CategoryItemView__name-truncated"
        title={wObject.name}
      >
        <Icon type="right" />
      </Link>
    </div>
  );
};

CategoryItemView.propTypes = {
  wObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  location: PropTypes.shape(),
  handleReportClick: PropTypes.func,
  isRejected: PropTypes.bool,
};

CategoryItemView.defaultProps = {
  location: '',
  handleReportClick: () => {},
};

export default injectIntl(CategoryItemView);
