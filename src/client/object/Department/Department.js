import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import DepartmentList from './DepartmentList';
import './Department.less';
import { isMobile } from '../../../common/helpers/apiHelpers';

const Department = ({ wobject, departments, isEditMode, isSocialGifts }) => (
  <div
    className={classNames(isSocialGifts ? 'flex ' : 'flex-column', { paddingBottom: !isEditMode })}
  >
    {!isEditMode && !isEmpty(departments) && (
      <div className="CompanyId__title">
        <FormattedMessage id="departments" formattedMessage="Departments" />:{' '}
      </div>
    )}
    <div className={isSocialGifts && !isMobile() ? 'Department__wrapper' : ''}>
      <DepartmentList
        isSocialGifts={isSocialGifts}
        wobject={wobject}
        departments={wobject?.departments}
      />
    </div>
  </div>
);

Department.propTypes = {
  wobject: PropTypes.shape().isRequired,
  departments: PropTypes.arrayOf().isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isSocialGifts: PropTypes.bool,
};

export default Department;
