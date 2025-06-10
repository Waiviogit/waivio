import React, { useEffect, useMemo, useState } from 'react';
import { debounce, isEmpty, isNil } from 'lodash';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';
import Cookie from 'js-cookie';
import { useSelector } from 'react-redux';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../../store/authStore/authSelectors';
import { getAdminSpam, getAdminSpamUserDetails } from '../../../../waivioApi/ApiClient';
import AdminSpamUsers from './AdminSpamUsers';
import AdminSpamDetails from './AdminSpamDetails';

const limit = 100;
const AdminSpam = () => {
  const [users, setGuestUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [user, setUser] = useState({});
  const [details, setDetails] = useState([]);
  const [search, setSearch] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [hasMoreDetails, setHasMoreDetails] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loadDetails, setLoadDetails] = useState(false);
  const authUserName = useSelector(getAuthenticatedUserName);
  const isAuth = useSelector(getIsAuthenticated);
  const history = useHistory();
  const appAdmins = Cookie.get('appAdmins');
  const iaAppAdmin = appAdmins?.includes(authUserName);
  const searchString = isEmpty(search) ? undefined : search;

  const debouncedSetSearch = useMemo(
    () =>
      debounce(value => {
        setSearch(value);
      }, 500),
    [],
  );

  const handleSearch = value => {
    debouncedSetSearch(value);
  };

  useEffect(() => {
    if (isAuth && iaAppAdmin) {
      setLoading(true);
      getAdminSpam(authUserName, 0, limit).then(r => {
        setGuestUsers(r.result);
        setHasMore(r.hasMore);

        const initiallyBlocked = r.result.filter(u => u.blocked).map(u => u.name);

        setBlockedUsers(initiallyBlocked);

        setLoading(false);
      });
    } else {
      history.push('/');
    }
  }, [isAuth, authUserName]);

  useEffect(() => {
    if (!isNil(search))
      getAdminSpam(authUserName, 0, limit, searchString).then(r => {
        setGuestUsers(r.result);
        const initiallyBlocked = r.result.filter(u => u.blocked).map(u => u.name);

        setBlockedUsers(initiallyBlocked);
      });
  }, [search]);

  const loadMore = () => {
    setListLoading(true);
    getAdminSpam(authUserName, users.length, limit, searchString).then(r => {
      setListLoading(false);
      setGuestUsers([...users, ...r.result]);

      const newlyBlocked = r.result.filter(u => u.blocked).map(u => u.name);

      setBlockedUsers(prev => [...prev, ...newlyBlocked.filter(name => !prev.includes(name))]);
    });
  };

  const getMoreDetails = name => {
    setLoadDetails(true);
    getAdminSpamUserDetails(authUserName, name, details.length).then(r => {
      setLoadDetails(false);
      setDetails([...details, ...r.result]);
      setHasMoreDetails(r.hasMore);
    });
  };

  return (
    <div>
      {showDetails ? (
        <AdminSpamDetails
          setDetails={setDetails}
          loadDetails={loadDetails}
          details={details}
          setShowDetails={setShowDetails}
          hasMoreDetails={hasMoreDetails}
          getMoreDetails={getMoreDetails}
        />
      ) : (
        <AdminSpamUsers
          setHasMoreDetails={setHasMoreDetails}
          setBlockedUsers={setBlockedUsers}
          setShowDetails={setShowDetails}
          user={user}
          users={users}
          handleSearch={handleSearch}
          loadMore={loadMore}
          open={open}
          blockedUsers={blockedUsers}
          limit={limit}
          setUser={setUser}
          search={search}
          loading={loading}
          hasMore={hasMore}
          setOpen={setOpen}
          listLoading={listLoading}
          setDetails={setDetails}
        />
      )}
    </div>
  );
};

export default injectIntl(AdminSpam);
