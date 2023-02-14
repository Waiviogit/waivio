import React, { useEffect, useState } from 'react';
import { Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { getObjectName } from '../../common/helpers/wObjectHelper';
import { getAuthenticatedUser } from '../../store/authStore/authSelectors';
import { getLocale } from '../../store/settingsStore/settingsSelectors';
import { getAuthorityFields } from '../../waivioApi/ApiClient';
import { appendObject, authorityVoteAppend } from '../../store/appendStore/appendActions';

const HeartButton = ({ wobject, size }) => {
  const [activeHeart, setActiveHeart] = useState(false);
  const user = useSelector(getAuthenticatedUser);
  const language = useSelector(getLocale);
  const dispatch = useDispatch();
  const upVotePower = 10000;
  const downVotePower = 9999;
  const tooltipTitle = activeHeart ? (
    <FormattedMessage id="remove_from_my_shop" defaultMessage="Remove from my shop" />
  ) : (
    <FormattedMessage id="add_to_my_shop" defaultMessage="Add to my shop" />
  );

  useEffect(() => {
    if (wobject?.authority?.weight > 0) {
      setActiveHeart(true);
    }
  }, [wobject.authority]);

  const getWobjectData = () => ({
    author: user.name,
    parentAuthor: wobject.author,
    parentPermlink: wobject.author_permlink,
    body: `@${user.name} added authority: administrative`,
    title: '',
    lastUpdated: Date.now(),
    wobjectName: getObjectName(wobject),
    votePower: upVotePower,
    field: { body: 'administrative', locale: language, name: 'authority' },
    permlink: `${user?.name}-${Math.random()
      .toString(36)
      .substring(2)}`,
  });

  const onHeartClick = () => {
    getAuthorityFields(wobject.author_permlink).then(postInformation => {
      if (isEmpty(postInformation)) {
        const data = getWobjectData();

        dispatch(appendObject(data, { votePercent: upVotePower }));
      }
      if (!isEmpty(postInformation)) {
        const [authority] = postInformation;

        dispatch(
          authorityVoteAppend(
            authority.author,
            authority.permlink,
            authority.weight > 0 ? downVotePower : upVotePower,
            'authority',
          ),
        );
      }
      setActiveHeart(!activeHeart);
    });
  };

  const heartClasses = classnames({ HeartButton__active: activeHeart, HeartButton: !activeHeart });

  return (
    <Tooltip
      placement="topLeft"
      title={tooltipTitle}
      overlayClassName="HeartButtonContainer"
      overlayStyle={{ top: '10px' }}
    >
      <button className={heartClasses} onClick={onHeartClick}>
        <Icon type="heart" theme="filled" style={{ fontSize: size }} />
      </button>
    </Tooltip>
  );
};

HeartButton.propTypes = {
  wobject: PropTypes.shape().isRequired,
  size: PropTypes.string.isRequired,
};

export default HeartButton;
