import React, { useState } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

function ProductId({ productIdBody, groupIdContent }) {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMoreState = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="CompanyId__container">
      <button className="CompanyId__button CompanyId__title" onClick={toggleShowMoreState}>
        Product ID{' '}
        {!showMore ? (
          <Icon type="down" className="CompanyId__icon" />
        ) : (
          <Icon type="up" className="CompanyId__icon" />
        )}
      </button>
      <div className="CompanyId__block">
        {showMore && (
          <div>
            {productIdBody?.map(obj => (
              <div key={obj.id} className="CompanyId__block-item">
                <p className="CompanyId__p">{obj.productIdType}</p>
                <p className="CompanyId__p">{obj.productId}</p>
                <div className="field-avatar CompanyId__p CompanyId__image">
                  {obj.productIdImage && <img src={obj.productIdImage} alt="pic" />}
                </div>
              </div>
            ))}
            <div>{groupIdContent}</div>
          </div>
        )}
      </div>
    </div>
  );
}
ProductId.propTypes = {
  productIdBody: PropTypes.string.isRequired,
  groupIdContent: PropTypes.string.isRequired,
};

export default ProductId;
