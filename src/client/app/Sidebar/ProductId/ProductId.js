import React, { useState, useLayoutEffect } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import GroupIdContent from './GroupIdContent';

const ProductId = ({ productIdBody, groupId, authorPermlink, isSocialGifts, intl }) => {
  const [showMore, setShowMore] = useState(true);
  const toggleShowMoreState = () => {
    setShowMore(!showMore);
  };

  useLayoutEffect(() => {
    toggleShowMoreState();
  }, []);

  return (
    (groupId || Boolean(productIdBody.length)) && (
      <div className="CompanyId__container">
        <button className="CompanyId__button CompanyId__title" onClick={toggleShowMoreState}>
          {intl.formatMessage({ id: 'productIds', defaultMessage: 'Product IDs' })}:{' '}
          {isSocialGifts ? (
            <span className="CompanyId__websiteColor">
              {!showMore
                ? intl.formatMessage({ id: 'show', defaultMessage: '(show)' })
                : intl.formatMessage({ id: 'hide', defaultMessage: '(hide)' })}
            </span>
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
                        {obj.productIdImage && (
                          <img
                            src={obj.productIdImage}
                            alt={`${obj.productIdType}: ${obj.productId}`}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={obj.id} className="CompanyId__block-item">
                      <p className="CompanyId__p">{obj.productIdType}</p>
                      <p className="CompanyId__p">{obj.productId}</p>
                      <div className="field-avatar CompanyId__p CompanyId__image">
                        {obj.productIdImage && (
                          <img
                            src={obj.productIdImage}
                            alt={`${obj.productIdType}: ${obj.productId}`}
                          />
                        )}
                      </div>
                    </div>
                  ),
                )}
                <GroupIdContent
                  authorPermlink={authorPermlink}
                  groupId={groupId}
                  isSocialGifts={isSocialGifts}
                />
              </div>
            )
          ) : (
            <GroupIdContent
              isSocialGifts={isSocialGifts}
              authorPermlink={authorPermlink}
              groupId={groupId}
            />
          )}
        </div>
      </div>
    )
  );
};

ProductId.propTypes = {
  productIdBody: PropTypes.arrayOf(PropTypes.shape({})),
  isSocialGifts: PropTypes.bool,
  authorPermlink: PropTypes.string.isRequired,
  groupId: PropTypes.arrayOf(PropTypes.string),
  intl: PropTypes.shape().isRequired,
};

ProductId.defaultProps = {
  productIdBody: '',
  isSocialGifts: false,
};
export default injectIntl(ProductId);
