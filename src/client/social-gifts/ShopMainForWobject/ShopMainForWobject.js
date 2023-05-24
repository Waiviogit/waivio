import React, { useEffect } from 'react';
import { Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { isEmpty } from 'lodash';

import { getNavigItems } from '../../../store/appStore/appSelectors';

const ShopMainForWobject = () => {
  const history = useHistory();
  const linkList = useSelector(getNavigItems);

  useEffect(() => {
    if (!isEmpty(linkList)) history.push(linkList[0].link);
  }, [linkList]);

  return <Skeleton active />;
};

export default ShopMainForWobject;
