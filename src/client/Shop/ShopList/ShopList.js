import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { useRouteMatch } from 'react-router';

import { getShopUserShopMainFeed } from '../../../waivioApi/ApiClient';
import ObjectCardView from '../../objectCard/ObjectCardView';

import './ShopList.less';

const ShopList = () => {
  const [departments, setDepartments] = useState([]);
  const match = useRouteMatch();

  useEffect(() => {
    getShopUserShopMainFeed(match.params.name, 0, 10).then(res => {
      setDepartments(res);
    });
  }, []);

  return (
    <div className="ShopList">
      <h3>Departmens</h3>
      <div>
        {departments.map(dep => {
          if (isEmpty(dep.wobjects)) return null;

          return (
            <div key={dep.department} className="ShopList__departments">
              <Link
                to={`/@${match.params.name}/shop/${dep.department}`}
                className="ShopList__title"
              >
                {dep.department} <Icon size={12} type="right" />
              </Link>
              {dep.wobjects.map(wObject => (
                <ObjectCardView key={wObject.author_permlink} wObject={wObject} />
              ))}
              {dep.showMore && (
                <Link className="ShopList__showMore">Show more {dep.department.toLowerCase()}</Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopList;
