import React, { useState } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

function ProductId({ productIdBody }) {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMoreState = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="CompanyId__container">
      <button className="CompanyId__button" onClick={toggleShowMoreState}>
        Product ID{' '}
        {!showMore ? (
          <Icon type="down" className="CompanyId__icon" />
        ) : (
          <Icon type="up" className="CompanyId__icon" />
        )}
      </button>
      <div className="CompanyId__block">
        {showMore &&
          productIdBody.forEach(obj => (
            <div className="CompanyId__block-item">
              <p className="CompanyId__p">{obj.productIdType}</p>
              <p className="CompanyId__p">{obj.productId}</p>
              <div className="field-avatar CompanyId__p">
                {obj.productIdImage && <img src={obj.productIdImage} alt="pic" />}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
ProductId.propTypes = {
  productIdBody: PropTypes.string.isRequired,
};

export default ProductId;
