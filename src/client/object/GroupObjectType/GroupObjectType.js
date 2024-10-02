import React, { useState } from 'react';
import { last } from 'lodash';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { getGroupObjectUserList } from '../../../waivioApi/ApiClient';
import UserDynamicList from '../../user/UserDynamicList';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const limit = 100;
const GroupObjectType = () => {
  const [lastUser, setLastUser] = useState(undefined);
  const { name } = useParams();
  const authUser = useSelector(getAuthenticatedUserName);

  const fetcher = async () => {
    const response = await getGroupObjectUserList(name, authUser, limit, lastUser);
    const users = response.result;

    setLastUser(last(response.result)?.name);

    return { users, hasMore: response.hasMore };
  };

  return <UserDynamicList useDebounce threshold={1500} hideSort limit={limit} fetcher={fetcher} />;
};

export default GroupObjectType;
