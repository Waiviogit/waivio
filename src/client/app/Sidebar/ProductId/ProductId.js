import React, { useState } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import GroupIdContent from './GroupIdContent';

const ProductId = ({ productIdBody, groupId, authorPermlink }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMoreState = () => {
    setShowMore(!showMore);
  };

  return (
    (groupId || Boolean(productIdBody.length)) && (
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
          {productIdBody ? (
            showMore && (
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
                <GroupIdContent authorPermlink={authorPermlink} groupId={groupId} />
              </div>
            )
          ) : (
            <GroupIdContent authorPermlink={authorPermlink} groupId={groupId} />
          )}
        </div>
      </div>
    )
  );
};

ProductId.propTypes = {
  productIdBody: PropTypes.string,
  authorPermlink: PropTypes.string.isRequired,
  groupId: PropTypes.arrayOf(),
};

ProductId.defaultProps = {
  productIdBody: '',
};
export default ProductId;
