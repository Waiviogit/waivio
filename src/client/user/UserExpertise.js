import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { FormattedMessage, FormattedNumber } from 'react-intl';
import { getObjectsList } from '../../store/dynamicList/dynamicListActions';
import { getUrerExpertiseCounters } from '../../store/userStore/userActions';
import { getExpCounters } from '../../store/userStore/userSelectors';
import { getWobjectsWithUserWeight } from '../../waivioApi/ApiClient';
import ObjectDynamicList from '../object/ObjectDynamicList';
import { getLocale } from '../../store/settingsStore/settingsSelectors';
import { excludeHashtagObjType } from '../../common/constants/listOfObjectTypes';

import './UserExpertise.less';
import './UserFollowing.less';

const TabPane = Tabs.TabPane;
const limit = 30;

const UserExpertise = () => {
  const locale = useSelector(getLocale);
  const dispatch = useDispatch();
  const { wobjectsExpCount, hashtagsExpCount } = useSelector(getExpCounters);
  const { name, 0: tab } = useParams();
  const history = useHistory();
  const isHashtag = history?.location?.pathname?.includes('expertise-hashtags');

  useEffect(() => {
    dispatch(getUrerExpertiseCounters(name));
  }, []);

  const fetcher = (skip, authUser, isOnlyHashtags) =>
    getWobjectsWithUserWeight(
      name,
      skip,
      limit,
      authUser,
      isOnlyHashtags ? ['hashtag'] : excludeHashtagObjType,
      locale,
    );

  return (
    <div className="UserExpertise">
      <Tabs defaultActiveKey={tab} className="UserFollowers">
        <TabPane
          tab={
            <Link to={`/@${name}/expertise-hashtags`} className="UserExpertise__item">
              <FormattedMessage id="hashtag_value_placeholder" defaultMessage="Hashtags" />{' '}
              {!!hashtagsExpCount && <FormattedNumber value={hashtagsExpCount} />}
            </Link>
          }
          key="expertise-hashtags"
        >
          {isHashtag && (
            <ObjectDynamicList
              isOnlyHashtags
              limit={UserExpertise.limit}
              fetcher={fetcher}
              expertize
            />
          )}
        </TabPane>
        <TabPane
          tab={
            <Link to={`/@${name}/expertise-objects`} className="UserExpertise__item">
              <FormattedMessage id="objects" defaultMessage="Objects" />{' '}
              {!!wobjectsExpCount && <FormattedNumber value={wobjectsExpCount} />}
            </Link>
          }
          key="expertise-objects"
        >
          {!isHashtag && (
            <ObjectDynamicList
              limit={UserExpertise.limit}
              fetcher={fetcher}
              expertize
              isOnlyHashtags={false}
            />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

UserExpertise.propTypes = {};

UserExpertise.fetchData = ({ match, store }) => {
  const fetcher = (skip, authUser, isOnlyHashtags) =>
    getWobjectsWithUserWeight(
      match.params.name,
      skip,
      limit,
      authUser,
      isOnlyHashtags ? ['hashtag'] : excludeHashtagObjType,
    );

  return Promise.allSettled([
    store.dispatch(getUrerExpertiseCounters(match.params.name)),
    store.dispatch(
      getObjectsList(fetcher, limit, 0, match.params[0], match.params[0] === 'expertise-hashtags'),
    ),
  ]);
};

export default UserExpertise;
