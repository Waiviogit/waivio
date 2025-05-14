import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { getAppHost } from '../../../store/appStore/appSelectors';
import { getMenuItemContent } from '../../../store/wObjectStore/wobjectsActions';
import { getMenuItemsFromState } from '../../../store/wObjectStore/wObjectSelectors';

import { sortListItemsBy } from '../../object/wObjectHelper';
import CheckListView from './CheckListView';
import { getSuitableLanguage } from '../../../store/reducers';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const NestedChecklist = ({ permlink }) => {
  const locale = useSelector(getSuitableLanguage);
  const userName = useSelector(getAuthenticatedUserName);
  const wobject = useSelector(getMenuItemsFromState)[permlink];
  const host = useSelector(getAppHost);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [listItems, setLists] = useState(wobject?.listItems);

  useEffect(() => {
    if (permlink && isEmpty(wobject)) {
      setLoading(true);
      dispatch(getMenuItemContent(permlink, userName, locale)).then(res => {
        const wObject = res.value;

        setLists(
          sortListItemsBy(
            wObject?.listItems,
            isEmpty(wObject?.sortCustom) ? 'rank' : 'custom',
            wObject?.sortCustom,
            host,
          ),
        );
        setLoading(false);
      });
    }
  }, [permlink]);

  return (
    <CheckListView
      isNested
      hideBreadCrumbs
      wobject={wobject}
      listItems={listItems}
      loading={loading}
    />
  );
};

NestedChecklist.propTypes = {
  permlink: PropTypes.string,
};

export default NestedChecklist;
