import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'antd';

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
import DepartmentsMobile from '../ShopDepartments/DepartmentsMobile';
import FiltersForMobile from '../../newRewards/Filters/FiltersForMobile';
import UserFilters from '../ShopFilters/UserFilters';
import WobjectShopFilter from '../../object/ObjectTypeShop/WobjectShopFilter';
import GlobalShopFilters from '../ShopFilters/GlobalShopFilters';
import Loading from '../../components/Icon/Loading';

import './ListSwitch.less';

const ListSwitcher = props => {
  const activeCrumb = useSelector(getActiveBreadCrumb);
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const [visibleNavig, setVisibleNavig] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);

  const list = useMemo(() => {
    if (!activeCrumb && match.params.department) return <Loading />;

    if (activeCrumb?.subdirectory || !match.params.department) {
      switch (props.type) {
        case 'user':
          return <UserShoppingList user={props.user} />;
        case 'wobject':
          return <WobjectShoppingList permlink={props.user} />;

        default:
          return <GlobalShopingList />;
      }
    }

    return (
      <DepartmentsWobjList
        getDepartmentsFeed={props.getDepartmentsFeed}
        user={props.user}
        setVisibleNavig={props.setVisibleNavig}
      />
    );
  }, [props.type, props.user, activeCrumb, match.params.name, match.params.department]);

  const filter = useMemo(() => {
    const closeFilter = () => setVisibleFilter(false);

    switch (props.type) {
      case 'user':
        return <UserFilters userName={props.user} onClose={closeFilter} />;

      case 'wobject':
        return <WobjectShopFilter onClose={closeFilter} />;

      default:
        return <GlobalShopFilters onClose={closeFilter} />;
    }
  }, [props.type, activeCrumb, match.params.name, match.params.department]);

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
        {match.params.department && <Icon type="right" />}{' '}
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
      <div className={'ListSwitcher__navInfo'}>
        <DepartmentsMobile
          type={props.type}
          visible={visibleNavig}
          setVisible={vis => setVisibleNavig(vis)}
        />
        <FiltersForMobile setVisible={() => setVisibleFilter(true)} />
      </div>
      <Modal
        visible={visibleFilter}
        onCancel={() => setVisibleFilter(false)}
        onOk={() => setVisibleFilter(false)}
      >
        {filter}
      </Modal>
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
};

export default ListSwitcher;
