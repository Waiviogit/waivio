import React, { useState } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

import './CompanyId.less';

function CompanyId({ companyIdBody, isSocial }) {
  const [showMore, setShowMore] = useState(false);
  const showMoreBtn = isSocial ? <a>(show)</a> : <Icon type="down" className="CompanyId__icon" />;
  const showLessBtn = isSocial ? <a>(hide)</a> : <Icon type="up" className="CompanyId__icon" />;
  const toggleShowMoreState = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="CompanyId__container">
      <button className="CompanyId__button" onClick={toggleShowMoreState}>
        {isSocial ? <b>Company IDs: </b> : <span>Company ID </span>}
        {!showMore ? showMoreBtn : showLessBtn}
      </button>
      <div className="CompanyId__block">
        {showMore &&
          companyIdBody?.map(obj => (
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
  isSocial: PropTypes.bool,
  companyIdBody: PropTypes.string.isRequired,
};

CompanyId.defaultProps = {
  isSocial: false,
};

export default CompanyId;
