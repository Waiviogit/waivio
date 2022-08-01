import React, { useState } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

import './CompanyId.less';

function CompanyId({ companyIdBody }) {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMoreState = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="CompanyId__container">
      <button className="CompanyId__button" onClick={toggleShowMoreState}>
        Company ID{' '}
        {!showMore ? (
          <Icon type="down" className="CompanyId__icon" />
        ) : (
          <Icon type="up" className="CompanyId__icon" />
        )}
      </button>
      <div className="CompanyId__block">
        {showMore &&
          companyIdBody.map(obj => (
            // eslint-disable-next-line react/jsx-key
            <div className="CompanyId__block-item">
              <p className="CompanyId__p">{obj.companyIdType}</p>
              <p className="CompanyId__p">{obj.companyId}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
CompanyId.propTypes = {
  companyIdBody: PropTypes.string.isRequired,
};

export default CompanyId;
