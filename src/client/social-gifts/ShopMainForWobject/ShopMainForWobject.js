import React, { useEffect } from 'react';
import { Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { getInfoLoaded, getNavigItems } from '../../../store/appStore/appSelectors';

const ShopMainForWobject = ({ wobjPermlink }) => {
  const history = useHistory();
  const linkList = useSelector(getNavigItems);
  const loaded = useSelector(getInfoLoaded);

  useEffect(() => {
    if (loaded) {
      if (!isEmpty(linkList)) history.push(linkList[0].link);
      else history.push(`/object/product/${wobjPermlink}`);
    }
  }, [linkList]);

  return <Skeleton active />;
};

ShopMainForWobject.propTypes = {
  wobjPermlink: PropTypes.string,
};

export default ShopMainForWobject;
