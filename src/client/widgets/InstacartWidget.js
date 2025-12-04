import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isNewInstacartProgram } from '../../common/helpers/wObjectHelper';
import { getInstacartLink, websiteStatisticsAction } from '../../waivioApi/ApiClient';
import { isMobile } from '../../common/helpers/apiHelpers';

import './AffiliatLinks/AffiliatLink.less';
import EarnsCommissionsOnPurchases from '../statics/EarnsCommissionsOnPurchases';

const InstacartWidget = ({
  wobjPerm,
  instacartAff,
  className,
  isProduct,
  withDisclamer,
  marginBottom,
  inlineFlex,
  inCard,
  buttonText,
  isRecipe,
}) => {
  const [link, setLink] = useState('');

  useEffect(() => {
    getInstacartLink(wobjPerm).then(url => setLink(url));
  }, [wobjPerm]);

  const handleClick = () => {
    websiteStatisticsAction().then(res => {
      if (res.result && typeof window !== 'undefined' && window?.gtag) {
        window.gtag('event', 'buy_now', { debug_mode: true });
      }
    });
  };

  const getButtonText = () => {
    if (buttonText) return buttonText;

    if (!isRecipe || inCard) return 'Get Ingredients';

    return 'Get Recipe Ingredients';
  };

  if (isNewInstacartProgram(instacartAff)) {
    return (
      <div
        style={{
          display: inlineFlex ? 'inline-flex' : 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: marginBottom || (isProduct ? '15px' : '10px'),
          width: isMobile() ? '100%' : undefined,
        }}
      >
        <div className="container">
          <a
            className="btn btn-acct AffiliatLink instacart"
            href={link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#003D29',
              color: '#FAF1E5',
              padding: '16px 18px',
              cursor: link ? 'pointer' : 'not-allowed',
              height: inCard ? '40px' : '46px',
              borderRadius: '24px',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: inCard ? '13px' : '16px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              margin: '0 auto',
              minWidth: inCard ? '150px' : '250px',
              textDecoration: 'none',
            }}
          >
            <img
              className="instacart"
              src="/images/Instacart-logo-carrot.svg"
              alt="Instacart logo"
              style={{ height: inCard ? '18px' : '22px', marginRight: '2px' }}
            />
            <span>{getButtonText()}</span>
          </a>
        </div>
        {withDisclamer && <EarnsCommissionsOnPurchases />}
      </div>
    );
  }

  return (
    <div
      style={{
        display: inlineFlex ? 'inline-flex' : 'flex',
        flexDirection: 'column',
        width: isMobile() ? '100%' : undefined,
      }}
    >
      <div
        className={className}
        id="shop-with-instacart-v1"
        data-affiliate_id={instacartAff?.affiliateCode}
        data-source_origin="affiliate_hub"
        data-affiliate_platform="recipe_widget"
        style={
          isProduct
            ? { marginBottom: marginBottom || '15px' }
            : { display: 'flex', justifyContent: 'center', marginBottom: marginBottom || '10px' }
        }
      />
      {withDisclamer && <EarnsCommissionsOnPurchases />}
    </div>
  );
};

InstacartWidget.propTypes = {
  wobjPerm: PropTypes.string,
  instacartAff: PropTypes.shape({
    affiliateCode: PropTypes.string,
    link: PropTypes.string,
  }),
  className: PropTypes.string,
  isProduct: PropTypes.bool,
  withDisclamer: PropTypes.bool,
  marginBottom: PropTypes.string,
  inlineFlex: PropTypes.bool,
  inCard: PropTypes.bool,
  buttonText: PropTypes.string,
  isRecipe: PropTypes.bool,
};

export default InstacartWidget;
