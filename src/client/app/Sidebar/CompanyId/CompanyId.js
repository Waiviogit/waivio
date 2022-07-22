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
    <React.Fragment>
      <button className="CompanyId__button" onClick={toggleShowMoreState}>
        Company ID {!showMore ? <Icon type="down" /> : <Icon type="up" />}
      </button>
      <div>
        {showMore &&
          companyIdBody.map(obj => (
            // eslint-disable-next-line react/jsx-key
            <div className="CompanyId__block">
              <p>{obj.companyIdType}</p>
              <p>{obj.companyId}</p>
            </div>
          ))}
      </div>
    </React.Fragment>
  );
}
CompanyId.propTypes = {
  companyIdBody: PropTypes.string.isRequired,
};

export default CompanyId;
