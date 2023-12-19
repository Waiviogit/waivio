import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { FormattedMessage, FormattedNumber } from 'react-intl';
import { getExpertiseCounters, getWobjectsWithUserWeight } from '../../waivioApi/ApiClient';
import ObjectDynamicList from '../object/ObjectDynamicList';
import { getLocale } from '../../store/settingsStore/settingsSelectors';

import './UserExpertise.less';
import { excludeHashtagObjType } from '../../common/constants/listOfObjectTypes';

const TabPane = Tabs.TabPane;
const limit = 30;

const UserExpertise = () => {
  const [wobjsExpCount, setWobjectsExpCount] = useState();
  const [hashsExpCount, setHashtagsExpCount] = useState();
  const locale = useSelector(getLocale);
  const { name, 0: tab } = useParams();

  useEffect(() => {
    getExpertiseCounters(name).then(({ hashtagsExpCount, wobjectsExpCount }) => {
      setWobjectsExpCount(wobjectsExpCount);
      setHashtagsExpCount(hashtagsExpCount);
    });
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
              {!!hashsExpCount && <FormattedNumber value={hashsExpCount} />}
            </Link>
          }
          key="expertise-hashtags"
        >
          <ObjectDynamicList
            isOnlyHashtags
            limit={UserExpertise.limit}
            fetcher={fetcher}
            expertize
          />
        </TabPane>
        <TabPane
          tab={
            <Link to={`/@${name}/expertise-objects`} className="UserExpertise__item">
              <FormattedMessage id="objects" defaultMessage="Objects" />{' '}
              {!!wobjsExpCount && <FormattedNumber value={wobjsExpCount} />}
            </Link>
          }
          key="expertise-objects"
        >
          <ObjectDynamicList limit={UserExpertise.limit} fetcher={fetcher} expertize />
        </TabPane>
      </Tabs>
    </div>
  );
};

UserExpertise.propTypes = {};

export default UserExpertise;
