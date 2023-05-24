import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import './SocialProduct.less';
import { getObject } from '../../../waivioApi/ApiClient';

import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getUsedLocale } from '../../../store/appStore/appSelectors';

const SocialProduct = () => {
  const userName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const locale = useSelector(getUsedLocale);
  const authorPermlink = match.params.name;
  const [wobject, setWobject] = useState({});

  useEffect(() => {
    if (!isEmpty(authorPermlink)) {
      getObject(authorPermlink, userName, locale).then(obj => setWobject(obj));
    }
  }, []);

  return (
    <div className="SocialProduct">
      <div className="SocialProduct__column SocialProduct__column-wrapper">
        <div className="SocialProduct__row"> SocialProduct1.1</div>
        <div className="SocialProduct__row"> SocialProduct1.2</div>
      </div>
      <div className="SocialProduct__column">{wobject.name}</div>
    </div>
  );
};

export default SocialProduct;
