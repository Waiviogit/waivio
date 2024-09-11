import React, { useState } from 'react';
import { last } from 'lodash';
import { useParams } from 'react-router';
import { getGroupObjectUserList } from '../../../waivioApi/ApiClient';
import UserDynamicList from '../../user/UserDynamicList';

const limit = 100;
const GroupObjectType = () => {
  const [lastUser, setLastUser] = useState('');
  const { name } = useParams();

  const fetcher = async () => {
    const response = await getGroupObjectUserList(name, limit, lastUser);
    const users = response.result;

    setLastUser(last(response.result)?.name);

    return { users, hasMore: response.hasMore };
  };

  return <UserDynamicList hideSort limit={limit} fetcher={fetcher} />;
};

export default GroupObjectType;
