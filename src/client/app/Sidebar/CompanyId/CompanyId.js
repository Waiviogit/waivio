import React from 'react';
import { Icon } from 'antd';
import './CompanyId.less';

function CompanyId() {
  const onCompanyIdBtnClick = () => {};

  return (
    <>
      <button className="CompanyId_button" onClick={onCompanyIdBtnClick}>
        {' '}
        Company ID <Icon type="down" />
      </button>
    </>
  );
}

export default CompanyId;
