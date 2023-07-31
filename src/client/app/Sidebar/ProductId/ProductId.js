import React, { useState } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import GroupIdContent from './GroupIdContent';

const ProductId = ({ productIdBody, groupId, authorPermlink, isSocialGifts }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMoreState = () => {
    setShowMore(!showMore);
  };

  return (
    (groupId || Boolean(productIdBody.length)) && (
      <div className="CompanyId__container">
        <button className="CompanyId__button CompanyId__title" onClick={toggleShowMoreState}>
          Product IDs:{' '}
          {isSocialGifts ? (
            <span className="CompanyId__websiteColor">{!showMore ? '(show)' : '(hide)'}</span>
          ) : (
            <>
              {!showMore ? (
                <Icon type="down" className="CompanyId__icon" />
              ) : (
                <Icon type="up" className="CompanyId__icon" />
              )}
            </>
          )}
        </button>
        <div className="CompanyId__block">
          {productIdBody ? (
            showMore && (
              <div>
                {productIdBody?.map(obj =>
                  isSocialGifts ? (
                    <div key={obj.id}>
                      {obj.productIdType}: {obj.productId}
                      <div className="field-avatar CompanyId__p CompanyId__image">
                        {obj.productIdImage && <img src={obj.productIdImage} alt="pic" />}
                      </div>
                    </div>
                  ) : (
                    <div key={obj.id} className="CompanyId__block-item">
                      <p className="CompanyId__p">{obj.productIdType}</p>
                      <p className="CompanyId__p">{obj.productId}</p>
                      <div className="field-avatar CompanyId__p CompanyId__image">
                        {obj.productIdImage && <img src={obj.productIdImage} alt="pic" />}
                      </div>
                    </div>
                  ),
                )}
                <GroupIdContent authorPermlink={authorPermlink} groupId={groupId} isSocialGifts />
              </div>
            )
          ) : (
            <GroupIdContent isSocialGifts authorPermlink={authorPermlink} groupId={groupId} />
          )}
        </div>
      </div>
    )
  );
};

ProductId.propTypes = {
  productIdBody: PropTypes.arrayOf(),
  isSocialGifts: PropTypes.bool,
  authorPermlink: PropTypes.string.isRequired,
  groupId: PropTypes.arrayOf(),
};

ProductId.defaultProps = {
  productIdBody: '',
  isSocialGifts: false,
};
export default ProductId;
