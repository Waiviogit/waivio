import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import { getActiveBreadCrumb } from '../../../store/shopStore/shopSelectors';
import DepartmentsWobjList from '../DepartmentsWobjList/DepartmentsWobjList';
import UserShoppingList from '../ShopList/UserShoppingList';
import WobjectShoppingList from '../../object/ObjectTypeShop/WobjectShoppingList';
import GlobalShopingList from '../ShopList/GlobalShopingList';
import { resetBreadCrumb } from '../../../store/shopStore/shopActions';
import {
  createHash,
  getLastPermlinksFromHash,
  getPermlinksFromHash,
} from '../../../common/helpers/wObjectHelper';

import './ListSwitch.less';

const ListSwitcher = props => {
  const activeCrumb = useSelector(getActiveBreadCrumb);
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();

  const list = useMemo(() => {
    if (activeCrumb?.subdirectory) {
      switch (props.type) {
        case 'user':
          return <UserShoppingList />;
        case 'wobject':
          return <WobjectShoppingList />;

        default:
          return <GlobalShopingList />;
      }
    }

    return (
      <DepartmentsWobjList
        getDepartmentsFeed={props.getDepartmentsFeed}
        user={props.user}
        setVisibleNavig={props.setVisibleNavig}
        Filter={props.Filter}
      >
        {props.children}
      </DepartmentsWobjList>
    );
  }, [props.type, activeCrumb, match.params.name]);

  return (
    <div className={'ListSwitcher'}>
      <h3 className={'ListSwitcher__breadCrumbsWrap'}>
        <span
          className={'ListSwitcher__breadCrumbs'}
          onClick={() => {
            dispatch(resetBreadCrumb());
            history.push(props.path);
          }}
        >
          Departments
        </span>{' '}
        &gt;{' '}
        <Link
          className={classNames('ListSwitcher__breadCrumbs', {
            'ListSwitcher__breadCrumbs--active': !history.location.hash,
          })}
          to={`${props.path}/${match.params.department}`}
        >
          {match.params.department}
        </Link>{' '}
        {getPermlinksFromHash(history.location.hash).map(crumb => (
          <span key={crumb}>
            {' '}
            &gt;{' '}
            <Link
              className={classNames('ListSwitcher__breadCrumbs', {
                'ListSwitcher__breadCrumbs--active':
                  getLastPermlinksFromHash(history.location.hash) === crumb ||
                  match.params.department === crumb,
              })}
              to={createHash(history.location.hash, crumb)}
            >
              {crumb}
            </Link>
          </span>
        ))}
      </h3>
      {list}
    </div>
  );
};

ListSwitcher.propTypes = {
  getDepartmentsFeed: PropTypes.func,
  setVisibleNavig: PropTypes.func,
  user: PropTypes.string,
  type: PropTypes.string,
  path: PropTypes.string,
  children: PropTypes.node,
  Filter: PropTypes.node,
};

export default ListSwitcher;
