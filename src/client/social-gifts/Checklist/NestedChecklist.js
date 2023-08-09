import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { sortListItemsBy } from '../../object/wObjectHelper';
import CheckListView from './CheckListView';
import { getObject } from '../../../waivioApi/ApiClient';
import { getSuitableLanguage } from '../../../store/reducers';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const NestedChecklist = ({ permlink }) => {
  const [loading, setLoading] = useState(false);
  const [listItems, setLists] = useState([]);
  const [wobject, setWobject] = useState(null);

  const locale = useSelector(getSuitableLanguage);
  const userName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    setLoading(true);

    if (permlink) {
      setLoading(true);
      getObject(permlink, userName, locale).then(wObject => {
        setWobject(wObject);
        setLists(
          sortListItemsBy(
            wObject?.listItems,
            isEmpty(wObject?.sortCustom) ? 'rank' : 'custom',
            wObject?.sortCustom,
          ),
        );
        setLoading(false);
      });
    }
  }, [permlink]);

  return (
    <CheckListView hideBreadCrumbs wobject={wobject} listItems={listItems} loading={loading} />
  );
};

NestedChecklist.propTypes = {
  permlink: PropTypes.string,
};

export default NestedChecklist;
