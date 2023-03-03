import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ObjectCardView from '../../objectCard/ObjectCardView';
import EmptyCampaing from '../../statics/EmptyCampaing';
import Loading from '../../components/Icon/Loading';
import useQuery from '../../../hooks/useQuery';
import { parseQuery } from '../../../waivioApi/helpers';
import FiltersForMobile from '../../newRewards/Filters/FiltersForMobile';
import ShopFilters from '../ShopFilters/ShopFilters';
import DepartmentsMobile from '../ShopDepartments/DepartmentsMobile';
import './ShopList.less';

const ShopList = ({ userName, path, children, setVisibleNavig, getShopFeed }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const query = useQuery();
  const authUser = useSelector(getAuthenticatedUserName);

  const parseQueryForFilters = () => {
    const parsedQuery = parseQuery(query.toString());

    return Object.keys(parsedQuery).reduce(
      (acc, curr) => {
        if (curr === 'rating') return { ...acc, rating: +parsedQuery.rating };

        return {
          ...acc,
          tagCategory: [
            ...acc.tagCategory,
            {
              categoryName: curr,
              tags: parsedQuery[curr],
            },
          ],
        };
      },
      { tagCategory: [] },
    );
  };

  useEffect(() => {
    getShopFeed(userName, authUser, parseQueryForFilters()).then(res => {
      setDepartments(res);
      setLoading(false);
    });
  }, [query.toString()]);

  if (loading) return <Loading />;

  return (
    <div className="ShopList">
      <h3 className="ShopList__title">Departments</h3>
      <DepartmentsMobile setVisible={setVisibleNavig} />
      <FiltersForMobile setVisible={() => setVisible(true)} />
      {departments.every(dep => isEmpty(dep.wobjects)) ? (
        <EmptyCampaing emptyMessage={'This shop does not have any products.'} />
      ) : (
        <div>
          {departments.map(dep => {
            if (isEmpty(dep.wobjects)) return null;

            return (
              <div key={dep.department} className="ShopList__departments">
                <Link to={`${path}/${dep.department}`} className="ShopList__departments-title">
                  {dep.department} <Icon size={12} type="right" />
                </Link>
                {dep.wobjects.map(wObject => (
                  <ObjectCardView key={wObject.author_permlink} wObject={wObject} />
                ))}
                {dep.hasMore && (
                  <Link className="ShopList__showMore" to={`${path}/${dep.department}`}>
                    Show more {dep.department}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
      {children}
      {visible && <ShopFilters visible={visible} onClose={() => setVisible(false)} />}
    </div>
  );
};

ShopList.propTypes = {
  userName: PropTypes.string,
  path: PropTypes.string,
  setVisibleNavig: PropTypes.func,
  getShopFeed: PropTypes.func,
  children: PropTypes.node,
};

export default ShopList;
