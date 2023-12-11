import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { injectIntl } from 'react-intl';

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
          return <UserShoppingList isSocial={props.isSocial} name={props.user} />;
        case 'wobject':
          return <WobjectShoppingList isSocial={props.isSocial} name={props.user} />;

        default:
          return <GlobalShopingList />;
      }
    }

    return (
      <DepartmentsWobjList
        getDepartmentsFeed={props.getDepartmentsFeed}
        user={props.user}
        setVisibleNavig={props.setVisibleNavig}
        isSocial={props.isSocial}
      />
    );
  }, [props.type, props.user, activeCrumb, match.params.name, match.params.department]);

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
          {props.intl.formatMessage({ id: 'departments', defaultMessage: 'Departments' })}
        </span>{' '}
        {match.params.department && (
          <React.Fragment>
            <Icon type="right" />{' '}
            <Link
              className={classNames('ListSwitcher__breadCrumbs', {
                'ListSwitcher__breadCrumbs--active': !history.location.hash,
              })}
              to={`${props.path}/${match.params.department}`}
            >
              {match.params.department}
            </Link>{' '}
          </React.Fragment>
        )}
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
          isSocial={props.isSocial}
        />
        <FiltersForMobile visible={visibleFilter} setVisible={vis => setVisibleFilter(vis)} />
      </div>
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
  isSocial: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

export default injectIntl(ListSwitcher);
