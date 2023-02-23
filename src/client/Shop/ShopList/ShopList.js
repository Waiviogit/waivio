import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { useRouteMatch } from 'react-router';

import { getShopUserShopMainFeed } from '../../../waivioApi/ApiClient';
import ObjectCardView from '../../objectCard/ObjectCardView';
import EmptyCampaing from '../../statics/EmptyCampaing';
import Loading from '../../components/Icon/Loading';
import FiltersForMobile from '../../newRewards/Filters/FiltersForMobile';

import './ShopList.less';
import ShopFilters from '../ShopFilters/ShopFilters';

const ShopList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const match = useRouteMatch();

  useEffect(() => {
    getShopUserShopMainFeed(match.params.name, 0, 10).then(res => {
      setDepartments(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="ShopList">
      <h3>Departments</h3>
      <FiltersForMobile setVisible={() => setVisible(true)} />
      {departments.every(dep => isEmpty(dep.wobjects)) ? (
        <EmptyCampaing emptyMessage={'There are no objects for this department.'} />
      ) : (
        <div>
          {departments.map(dep => {
            if (isEmpty(dep.wobjects)) return null;

            return (
              <div key={dep.department} className="ShopList__departments">
                <Link
                  to={`/@${match.params.name}/shop/${dep.department}`}
                  className="ShopList__departments-title"
                >
                  {dep.department} <Icon size={12} type="right" />
                </Link>
                {dep.wobjects.map(wObject => (
                  <ObjectCardView key={wObject.author_permlink} wObject={wObject} />
                ))}
                {dep.hasMore && (
                  <Link
                    className="ShopList__showMore"
                    to={`/@${match.params.name}/shop/${dep.department}`}
                  >
                    Show more {dep.department}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
      {visible && <ShopFilters visible={visible} onClose={() => setVisible(false)} />}
    </div>
  );
};

export default ShopList;
