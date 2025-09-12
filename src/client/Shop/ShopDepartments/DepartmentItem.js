import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';

import { setBreadCrumb, setExcluded } from '../../../store/shopStore/shopActions';
import {
  getLastPermlinksFromHash,
  getPermlinksFromHash,
} from '../../../common/helpers/wObjectHelper';

import './ShopDepartments.less';

const DepartmentItem = ({
  department,
  match,
  excludedMain,
  onClose,
  getShopDepartments,
  path,
  pathList,
}) => {
  const [nestedDepartments, setNestedDepartments] = useState([]);
  const [showNested, setShowNested] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const categories = getPermlinksFromHash(history.location.hash);
  const urlDepartment = match.params.department || match.params.itemId;

  const itemClassList = classNames('ShopDepartmentsList__item', {
    'ShopDepartmentsList__item--withNested': department.subdirectory,
  });
  const depNameClassList = classNames('ShopDepartmentsList__depName', {
    'ShopDepartmentsList__depName--open': showNested,
  });
  const depNameWithoutNestedClassList = classNames('ShopDepartmentsList__link', {
    'ShopDepartmentsList__link--active':
      urlDepartment === department.name || categories?.includes(department.name),
  });
  const itemListClassList = classNames('ShopDepartmentsList__list', {
    'ShopDepartmentsList__list--show': showNested,
  });

  const getNestedDepartments = () => {
    if (urlDepartment && urlDepartment !== department.name) {
      const findIndex = categories.findIndex(el => el === department.name);
      const hashPermlinks = [...categories];

      if (findIndex >= 0) hashPermlinks.splice(findIndex + 1);
      else hashPermlinks.push(department.name);

      history.push(`#${hashPermlinks.join('/')}`);
    } else history.push(`${path}/${department.name}`);

    if (onClose) onClose();
  };

  useEffect(() => {
    if (
      (urlDepartment === department.name ||
        (urlDepartment !== department.name && categories?.includes(department.name))) &&
      department.subdirectory &&
      isEmpty(nestedDepartments)
    ) {
      getShopDepartments(department.name, excludedMain, [...pathList, department.name], true).then(
        res => {
          setNestedDepartments(res.value);
          setShowNested(true);
        },
      );
    }

    if (
      (!categories?.includes(department.name) && department.name !== urlDepartment) ||
      !urlDepartment
    ) {
      setShowNested(false);
    } else {
      setShowNested(true);
    }
  }, [urlDepartment, history.location.hash]);

  useEffect(() => {
    if (urlDepartment === department.name) {
      dispatch(setBreadCrumb(department));
      dispatch(setExcluded(excludedMain));
    }
  }, [urlDepartment]);

  useEffect(() => {
    if (
      history.location.hash &&
      getLastPermlinksFromHash(history.location.hash) === department.name
    ) {
      dispatch(setBreadCrumb(department));
      dispatch(setExcluded(excludedMain));
    }

    if (!history.location.hash && department.name === match.params.department) {
      dispatch(setBreadCrumb(department));
      dispatch(setExcluded(excludedMain));
    }
  }, [history.location.hash]);

  const excluded = [...excludedMain, ...nestedDepartments.map(nes => nes.name)];
  const renderList = nestedDepartments.some(j => categories?.includes(j.name))
    ? nestedDepartments.filter(perm => categories?.includes(perm.name))
    : nestedDepartments;

  return (
    <div className={itemClassList}>
      {department.subdirectory ? (
        <div onClick={getNestedDepartments} className={depNameClassList}>
          {department.name}
        </div>
      ) : (
        <div className={depNameWithoutNestedClassList} onClick={getNestedDepartments}>
          {department.name}
        </div>
      )}
      {showNested && (
        <div className={itemListClassList}>
          {renderList.map(nest => (
            <DepartmentItem
              key={nest.name}
              department={nest}
              match={match}
              excludedMain={excluded}
              onClose={onClose}
              getShopDepartments={getShopDepartments}
              path={path}
              pathList={[...pathList, department.name]}
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
    params: PropTypes.shape({
      department: PropTypes.string,
      itemId: PropTypes.string,
    }),
  }),
  excludedMain: PropTypes.arrayOf(PropTypes.string),
  pathList: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func,
  getShopDepartments: PropTypes.func,
  path: PropTypes.string,
};

DepartmentItem.defaultProps = {
  excludedMain: [],
};

export default DepartmentItem;
