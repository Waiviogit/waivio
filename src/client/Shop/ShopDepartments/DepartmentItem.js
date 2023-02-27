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
    if (match.params.department && match.params.department !== department.name) {
      let hash = history.location.hash
        ? `${history.location.hash}/${department.name}`
        : `#${department.name}`;

      if (history.location.hash.includes(department.name)) {
        const permlinks = getPermlinksFromHash(history.location.hash);
        const findIndex = permlinks.findIndex(el => el === department.name);
        const hashPermlinks = [...permlinks];

        if (findIndex >= 0) hashPermlinks.splice(findIndex);
        hash = `#${hashPermlinks.join('/')}`;
      }

      history.push(`${hash}`);
    } else history.push(`/shop/${department.name}`);

    getNestedItems();
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
  }, []);

  const itemClassList = classNames('ShopDepartmentsList__item', {
    'ShopDepartmentsList__item--withNested': department.subdirectory,
  });

  const depNameClassList = classNames({
    ShopDepartmentsList__depName: showNested,
  });

  const itemListClassList = classNames('ShopDepartmentsList__list', {
    'ShopDepartmentsList__list--show': showNested,
  });

  const excluded = [...excludedMain, ...nestedDepartments.map(nes => nes.name)];
  const renderList = nestedDepartments.some(j => categories.includes(j.name))
    ? nestedDepartments.filter(perm => categories.includes(perm.name))
    : nestedDepartments;

  return (
    <div className={itemClassList}>
      {department.subdirectory ? (
        <div onClick={getNestedDepartments} className={depNameClassList}>
          {department.name}{' '}
          <Icon style={{ fontSize: '12px' }} type={showNested ? 'down' : 'right'} />
        </div>
      ) : (
        <NavLink
          to={
            match.params.department && match.params.department !== department.name
              ? `/shop/${match.params.department}/#${createNewHash(
                  department.name,
                  history.location.hash,
                )}`
              : `/shop/${department.name}`
          }
          isActive={() =>
            match?.url.includes(`/${department.name}`) || categories.includes(department.name)
          }
          activeClassName="ShopDepartmentsList__item--active"
        >
          {department.name}
        </NavLink>
      )}
      <div className={itemListClassList}>
        {renderList.map(nest => (
          <DepartmentItem key={nest.name} department={nest} match={match} excludedMain={excluded} />
        ))}
      </div>
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
