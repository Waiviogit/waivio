import React, { useEffect } from 'react';
import { filter, isEmpty } from 'lodash';
import { useParams } from 'react-router';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { injectIntl } from 'react-intl';
import InfiniteSroll from 'react-infinite-scroller';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import Loading from '../../components/Icon/Loading';
import UserCard from '../../components/UserCard';
import WeightTag from '../../components/WeightTag';

import {
  followUserInList,
  setMoreUsersList,
  setUsersList,
  unfollowUserInList,
  updateUsersList,
} from '../../../store/dynamicList/dynamicListActions';
import {
  getDynamicList,
  getDynamicListLoading,
} from '../../../store/dynamicList/dynamicListSelectors';
import { objectFields } from '../../../common/constants/listOfFields';
import LANGUAGES from '../../../common/translations/languages';

import { getAppendData, getObjectName } from '../../../common/helpers/wObjectHelper';
import { appendObject } from '../../../store/appendStore/appendActions';

import { getUsedLocale } from '../../../store/appStore/appSelectors';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getVotePercent } from '../../../store/settingsStore/settingsSelectors';

const limit = 50;
const GroupObjectType = ({ authUser, dynamicListInfo, loading, intl }) => {
  const { hasMore, list, nextCursor } = dynamicListInfo;
  const params = useParams();
  const dispatch = useDispatch();
  const currentLocale = useSelector(getUsedLocale);
  const wObject = useSelector(getObject);
  const authUserName = useSelector(getAuthenticatedUserName);
  const votePercent = useSelector(getVotePercent);
  const name = params.name;

  useEffect(() => {
    dispatch(setUsersList(name, authUser, limit, undefined));
  }, [name]);

  const loadMore = () => {
    if (nextCursor) {
      dispatch(setMoreUsersList(name, authUser, limit, nextCursor));
    }
  };

  const handleExcludeUser = user => {
    dispatch(updateUsersList(user, name));
    const pageContentField = {
      name: objectFields.groupExclude,
      body: user,
      locale: currentLocale,
    };
    const langReadable = filter(LANGUAGES, { id: currentLocale })[0].name;

    const bodyMessage = `@${authUserName} added ${objectFields.groupExclude} (${langReadable}): @${user}`;
    const postData = getAppendData(authUser, wObject, bodyMessage, pageContentField);

    dispatch(
      appendObject(postData, {
        votePercent,
        isLike: true,
        isObjectPage: true,
      }),
    )
      .then(() => {
        message.success(
          intl.formatMessage(
            {
              id: 'exclude_user_success',
              defaultMessage: `The user was successfully excluded from the group.`,
            },
            {
              field: objectFields.pageContent,
              wobject: getObjectName(wObject),
            },
          ),
        );
      })
      .catch(error => {
        console.error('Component error:', error);
        message.error(
          intl.formatMessage({
            id: 'couldnt_append',
            defaultMessage: "Couldn't add the field to object.",
          }),
        );
      });
  };

  return (
    <div className="UserDynamicList">
      {loading ? (
        <Loading />
      ) : (
        <>
          <InfiniteSroll hasMore={hasMore} loader={<Loading />} loadMore={loadMore}>
            {list?.map(user => {
              if (user.name !== authUser) {
                return (
                  <UserCard
                    showFollow={false}
                    customBtn
                    customBtnName={'Exclude'}
                    onCustomBtnClick={() => handleExcludeUser(user.name)}
                    key={`${user.name}-${user._id}`}
                    user={user}
                    alt={<WeightTag weight={user.wobjects_weight || user.weight} />}
                  />
                );
              }

              return null;
            })}
          </InfiniteSroll>
          {isEmpty(list) && !loading && (
            <div className="UserDynamicList__empty">No users have been added yet.</div>
          )}
        </>
      )}
    </div>
  );
};

GroupObjectType.propTypes = {
  authUser: PropTypes.string.isRequired,
  dynamicListInfo: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
};
export default connect(
  (state, ownProps) => ({
    dynamicListInfo: getDynamicList(state, ownProps.match.params.name),
    loading: getDynamicListLoading(state),
    authUser: getAuthenticatedUserName(state),
  }),
  {
    unfollowUser: unfollowUserInList,
    followUser: followUserInList,
  },
)(injectIntl(GroupObjectType));
