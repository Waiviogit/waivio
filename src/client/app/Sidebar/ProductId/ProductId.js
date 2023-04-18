import React, { useState } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

const ProductId = ({ productIdBody, groupId, authorPermlink }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMoreState = () => {
    setShowMore(!showMore);
  };
  const groupIdContent = (
    <div className="field-info">
      <div className="CompanyId__title">
        <FormattedMessage id="object_field_groupId" formattedMessage="Group ID" />
      </div>
      {groupId?.map(id => (
        <div key={id} className="field-website__title">
          <Link
            to={`/object/${authorPermlink}/groupId/${id}`}
            className="CompanyId__wordbreak MenuItemButtons__link"
          >
            {id}
          </Link>
        </div>
      ))}
    </div>
  );

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
                <div>{groupIdContent}</div>
              </div>
            )
          ) : (
            <div>{groupIdContent}</div>
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
