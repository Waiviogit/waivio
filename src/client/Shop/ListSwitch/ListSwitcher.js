import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import { isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';

import { getActiveBreadCrumb } from '../../../store/shopStore/shopSelectors';
import DepartmentsWobjList from '../DepartmentsWobjList/DepartmentsWobjList';
import UserShoppingList from '../ShopList/UserShoppingList';
import WobjectShoppingList from '../../object/ObjectTypeShop/WobjectShoppingList';
import GlobalShopingList from '../ShopList/GlobalShopingList';
import { resetBreadCrumb } from '../../../store/shopStore/shopActions';
import {
  accessTypesArr,
  createHash,
  getLastPermlinksFromHash,
  getPermlinksFromHash,
  hasDelegation,
  haveAccess,
} from '../../../common/helpers/wObjectHelper';
import DepartmentsMobile from '../ShopDepartments/DepartmentsMobile';
import FiltersForMobile from '../../newRewards/Filters/FiltersForMobile';
import Loading from '../../components/Icon/Loading';
import { getIsEditMode, getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getObject as getObjectAction } from '../../../store/wObjectStore/wobjectsActions';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import { getUserAdministrator } from '../../../store/appStore/appSelectors';
import { setEditMode } from '../../../store/wObjectStore/wobjActions';
import './ListSwitch.less';
import { getUserShopSchema } from '../../../common/helpers/shopHelper';

const ListSwitcher = props => {
  const activeCrumb = useSelector(getActiveBreadCrumb);
  const currObj = useSelector(getObject);
  const username = useSelector(getAuthenticatedUserName);
  const authenticated = useSelector(getIsAuthenticated);
  const isEditMode = useSelector(getIsEditMode);
  const isAdministrator = useSelector(getUserAdministrator);
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const isRecipe = getUserShopSchema(history?.location?.pathname) === 'recipe';
  const [visibleNavig, setVisibleNavig] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const accessExtend =
    (haveAccess(currObj, username, accessTypesArr[0]) && isAdministrator) ||
    hasDelegation(currObj, username);

  const editObjectClick = () => {
    const backUrl = `/object-shop/${props.user}`;

    dispatch(setEditMode(true));
    history.push(`/object/${props.user}?viewUrl=${backUrl}`);
  };
  const list = useMemo(() => {
    if (!activeCrumb && match.params.department) return <Loading />;

    if (activeCrumb?.subdirectory || !match.params.department) {
      switch (props.type) {
        case 'user':
          return <UserShoppingList isSocial={props.isSocial} name={props.user} />;
        case 'wobject':
          if (props.user !== currObj?.author_permlink || isEmpty(currObj))
            dispatch(getObjectAction(props.user));

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
  }, [
    props.type,
    props.user,
    activeCrumb,
    match.params.name,
    match.params.department,
    isEditMode,
    currObj,
  ]);

  return (
    <div className={'ListSwitcher'}>
      <h3 className={'ListSwitcher__breadCrumbsWrap'}>
        <span>
          <span
            className={'ListSwitcher__breadCrumbs'}
            onClick={() => {
              dispatch(resetBreadCrumb());
              history.push(props.path);
            }}
          >
            {props.intl.formatMessage({
              id: `${isRecipe ? 'categories' : 'departments'}`,
              defaultMessage: `${isRecipe ? 'Categories' : 'Departments'}`,
            })}
          </span>{' '}
          {props.type === 'wobject' && accessExtend && authenticated && (
            <div className="Breadcrumbs__edit-container">
              <Button onClick={editObjectClick}>
                {props.intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
              </Button>
            </div>
          )}
        </span>
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
        <FiltersForMobile
          visible={visibleFilter}
          setVisible={vis => setVisibleFilter(vis)}
          type={props.type}
          user={props.user}
          isRecipePage={isRecipe}
        />
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
