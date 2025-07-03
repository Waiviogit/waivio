import React, { useEffect } from 'react';
import { Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { has, isEmpty } from 'lodash';
import { useRouteMatch } from 'react-router';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { setGoogleTagEvent } from '../../common/helpers';
import { getIsAuthenticated } from '../../store/authStore/authSelectors';
import { getAuthorityList } from '../../store/appendStore/appendSelectors';
import { setAuthorityForObject, setObjectinAuthority } from '../../store/appendStore/appendActions';
import { isMobile } from '../../common/helpers/apiHelpers';

const HeartButton = ({ wobject, size }) => {
  const authorityList = useSelector(getAuthorityList);
  const isAuth = useSelector(getIsAuthenticated);
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const activeHeart = authorityList[wobject.author_permlink];
  const adminAuthority = 'administrative';
  const shopObjTypes = ['book', 'product', 'service'].includes(wobject.object_type);
  const tooltipTitle = activeHeart ? (
    <FormattedMessage
      id={`remove_from_${shopObjTypes ? 'my_shop' : 'favorites'}`}
      defaultMessage={`Remove from ${shopObjTypes ? 'my shop' : 'favorites'}`}
    />
  ) : (
    <FormattedMessage
      id={`add_to_${shopObjTypes ? 'my_shop' : 'favorites'}`}
      defaultMessage={`Add to ${shopObjTypes ? 'my shop' : 'favorites'}`}
    />
  );

  useEffect(() => {
    if (
      !isEmpty(wobject.authority) &&
      wobject.authority.body === adminAuthority &&
      !has(authorityList, wobject.author_permlink)
    ) {
      dispatch(setObjectinAuthority(wobject.author_permlink));
    }
  }, [wobject.authority, authorityList]);

  if (!isAuth) return null;

  const onHeartClick = e => {
    e.stopPropagation();
    dispatch(setAuthorityForObject(wobject, match));
    setGoogleTagEvent('click_heart');
  };

  const heartClasses = classnames('HeartButton', { 'HeartButton--active': activeHeart });
  const heart = (
    <button className={heartClasses} onClick={onHeartClick} type="button">
      <Icon type="heart" theme="filled" style={{ fontSize: size }} />
    </button>
  );

  return !isMobile() ? (
    <Tooltip
      placement="topLeft"
      title={tooltipTitle}
      overlayClassName="HeartButtonContainer"
      overlayStyle={{ top: '10px' }}
    >
      {heart}
    </Tooltip>
  ) : (
    heart
  );
};

HeartButton.propTypes = {
  wobject: PropTypes.shape().isRequired,
  size: PropTypes.string.isRequired,
};

export default HeartButton;
