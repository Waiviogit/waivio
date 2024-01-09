import React, { useEffect } from 'react';
import { Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { has, isEmpty } from 'lodash';
import { useRouteMatch } from 'react-router';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { getObjectName } from '../../common/helpers/wObjectHelper';
import { getAuthenticatedUser, getIsAuthenticated } from '../../store/authStore/authSelectors';
import { getLocale, getVotePercent } from '../../store/settingsStore/settingsSelectors';
import { getAuthorityList } from '../../store/appendStore/appendSelectors';
import { getAuthorityFields } from '../../waivioApi/ApiClient';
import {
  appendObject,
  authorityVoteAppend,
  removeObjectFromAuthority,
  setObjectinAuthority,
} from '../../store/appendStore/appendActions';
import { isMobile } from '../../common/helpers/apiHelpers';

const HeartButton = ({ wobject, size }) => {
  const user = useSelector(getAuthenticatedUser);
  const userUpVotePower = useSelector(getVotePercent);
  const language = useSelector(getLocale);
  const authorityList = useSelector(getAuthorityList);
  const isAuth = useSelector(getIsAuthenticated);
  const dispatch = useDispatch();
  const downVotePower = 1;
  const match = useRouteMatch();
  const activeHeart = authorityList[wobject.author_permlink];
  const isObjectPage = match.params.name === wobject.author_permlink;
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

  const getWobjectData = () => ({
    author: user.name,
    parentAuthor: wobject.author,
    parentPermlink: wobject.author_permlink,
    body: `@${user.name} added authority: administrative`,
    title: '',
    lastUpdated: Date.now(),
    wobjectName: getObjectName(wobject),
    votePower: userUpVotePower,
    field: { body: adminAuthority, locale: language, name: 'authority' },
    permlink: `${user?.name}-${Math.random()
      .toString(36)
      .substring(2)}`,
  });

  const onHeartClick = () => {
    if (activeHeart) {
      dispatch(removeObjectFromAuthority(wobject.author_permlink));
    } else {
      dispatch(setObjectinAuthority(wobject.author_permlink));
    }
    getAuthorityFields(wobject.author_permlink).then(postInformation => {
      if (
        isEmpty(postInformation) ||
        isEmpty(postInformation.filter(p => p.creator === user.name && p.body === adminAuthority))
      ) {
        const data = getWobjectData();

        dispatch(appendObject(data, { votePercent: userUpVotePower, isLike: true, isObjectPage }));
      } else {
        const authority = postInformation.find(
          post => post.creator === user.name && post.body === adminAuthority,
        );

        dispatch(
          authorityVoteAppend(
            authority?.author,
            wobject.author_permlink,
            authority?.permlink,
            activeHeart ? downVotePower : userUpVotePower,
            isObjectPage,
          ),
        );
      }
    });
  };

  const heartClasses = classnames('HeartButton', { 'HeartButton--active': activeHeart });
  const heart = (
    <button className={heartClasses} onClick={onHeartClick}>
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
