import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router';

import { getShopDepartments } from '../../../waivioApi/ApiClient';
import { createNewHash, getPermlinksFromHash } from '../../../common/helpers/wObjectHelper';

import './ShopDepartments.less';

const DepartmentItem = ({ department, match, excludedMain }) => {
  const [nestedDepartments, setNestedDepartments] = useState([]);
  const [showNested, setShowNested] = useState(false);
  const history = useHistory();
  const categories = getPermlinksFromHash(history.location.hash);

  const getNestedItems = () => {
    if (isEmpty(nestedDepartments)) {
      getShopDepartments(department.name, excluded).then(res => {
        setNestedDepartments(res);
        setShowNested(true);
      });
    } else {
      setShowNested(!showNested);
    }
  };

  const getNestedDepartments = () => {
    if (match.params.department && match.params.department === department.name)
      return history.push('/shop');
    if (match.params.department && match.params.department !== department.name) {
      const findIndex = categories.findIndex(el => el === department.name);
      const hashPermlinks = [...categories];

      if (findIndex >= 0) hashPermlinks.splice(findIndex);
      else hashPermlinks.push(department.name);

      history.push(`#${hashPermlinks.join('/')}`);
    } else history.push(`/shop/${department.name}`);

    return getNestedItems();
  };

  useEffect(() => {
    if (
      match.params.department === department.name ||
      (match.params.department !== department.name && categories.includes(department.name))
    ) {
      getShopDepartments(department.name, excluded).then(res => {
        setNestedDepartments(res);
        setShowNested(true);
      });
    }
  }, [match.params.department]);

  useEffect(() => {
    if (
      (!categories.includes(department.name) && department.name !== match.params.department) ||
      !match.params.department
    ) {
      setShowNested(false);
    } else {
      setShowNested(true);
    }
  }, [history.location.hash, match.params.department]);

  const itemClassList = classNames('ShopDepartmentsList__item', {
    'ShopDepartmentsList__item--withNested': department.subdirectory,
  });

  const depNameClassList = classNames('ShopDepartmentsList__depName', {
    'ShopDepartmentsList__depName--open': showNested,
  });

  const itemListClassList = classNames('ShopDepartmentsList__list', {
    'ShopDepartmentsList__list--show': showNested,
  });

  const getLinkPath = () => {
    if (match.params.department === department.name) return '/shop';

    return match.params.department && match.params.department !== department.name
      ? `/shop/${match.params.department}/#${createNewHash(department.name, history.location.hash)}`
      : `/shop/${department.name}`;
  };

  const excluded = [...excludedMain, ...nestedDepartments.map(nes => nes.name)];
  const renderList = nestedDepartments.some(j => categories.includes(j.name))
    ? nestedDepartments.filter(perm => categories.includes(perm.name))
    : nestedDepartments;

  return (
    <div className={itemClassList}>
      {department.subdirectory ? (
        <div onClick={getNestedDepartments} className={depNameClassList}>
          {department.name} {!showNested && <Icon style={{ fontSize: '12px' }} type={'right'} />}
        </div>
      ) : (
        <NavLink
          to={getLinkPath()}
          isActive={() =>
            match?.url.includes(`/${department.name}`) || categories.includes(department.name)
          }
          activeClassName="ShopDepartmentsList__link-active"
          className="ShopDepartmentsList__link"
        >
          {department.name}
        </NavLink>
      )}
      {showNested && (
        <div className={itemListClassList}>
          {renderList.map(nest => (
            <DepartmentItem
              key={nest.name}
              department={nest}
              match={match}
              excludedMain={excluded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

DepartmentItem.propTypes = {
  department: PropTypes.shape({
    name: PropTypes.string,
    subdirectory: PropTypes.bool,
  }),
  match: PropTypes.shape({
    url: PropTypes.string,
    params: PropTypes.string,
  }),
  excludedMain: PropTypes.arrayOf(PropTypes.string),
};

DepartmentItem.defaultProps = {
  excludedMain: [],
};

export default DepartmentItem;