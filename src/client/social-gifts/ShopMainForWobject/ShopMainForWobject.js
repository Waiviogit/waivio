import React, { useEffect } from 'react';
import { Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { isEmpty } from 'lodash';

import { getInfoLoaded, getNavigItems } from '../../../store/appStore/appSelectors';

const ShopMainForWobject = () => {
  const history = useHistory();
  const linkList = useSelector(getNavigItems);
  const loaded = useSelector(getInfoLoaded);

  useEffect(() => {
    if (loaded && !isEmpty(linkList)) {
      history.push(linkList[0].link);
    }
  }, [linkList]);

  return <Skeleton active />;
};

ShopMainForWobject.propTypes = {};

export default ShopMainForWobject;
