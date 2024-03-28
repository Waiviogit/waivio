import React, { useState } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import './CompanyId.less';

function CompanyId({ companyIdBody, isSocial, intl }) {
  const [showMore, setShowMore] = useState(false);
  const showMoreBtn = isSocial ? (
    <a>{intl.formatMessage({ id: 'show', defaultMessage: '(show)' })}</a>
  ) : (
    <Icon type="down" className="CompanyId__icon" />
  );
  const showLessBtn = isSocial ? (
    <a>{intl.formatMessage({ id: 'hide', defaultMessage: '(hide)' })}</a>
  ) : (
    <Icon type="up" className="CompanyId__icon" />
  );
  const toggleShowMoreState = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="CompanyId__container">
      <button className="CompanyId__button" onClick={toggleShowMoreState}>
        {isSocial ? (
          <b>{intl.formatMessage({ id: 'companyIds', defaultMessage: 'Company IDs' })}: </b>
        ) : (
          <span>{intl.formatMessage({ id: 'companyId', defaultMessage: 'Company ID' })} </span>
        )}
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
  companyIdBody: PropTypes.arrayOf(
    PropTypes.shape({
      companyIdType: PropTypes.string,
      companyId: PropTypes.string,
    }),
  ).isRequired,
  intl: PropTypes.shape().isRequired,
};

CompanyId.defaultProps = {
  isSocial: false,
};

export default injectIntl(CompanyId);
