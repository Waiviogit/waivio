import { Icon } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { isNewInstacartProgram } from '../../common/helpers/wObjectHelper';
import { getInstacartLink, websiteStatisticsAction } from '../../waivioApi/ApiClient';

import './AffiliatLinks/AffiliatLink.less';
import EarnsCommissionsOnPurchases from '../statics/EarnsCommissionsOnPurchases';

const InstacartWidget = ({
  wobjPerm,
  instacartAff,
  className,
  isProduct,
  // containerClassName,
  withDisclamer,
  marginBottom,
  inlineFlex,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleClick = e => {
    e.preventDefault();
    setLoading(true);
    getInstacartLink(wobjPerm).then(link => {
      setLoading(false);
      websiteStatisticsAction().then(res => {
        if (res.result && typeof window !== 'undefined' && window?.gtag) {
          window.gtag('event', 'buy_now', { debug_mode: true });
        }
      });
      window && window.open(link, '_blank');
    });
  };

  return isNewInstacartProgram(instacartAff) ? (
    <div
      style={{
        display: inlineFlex ? 'inline-flex' : 'flex',
        flexDirection: 'column',
        marginBottom: marginBottom || (isProduct ? '15px' : '10px'),
      }}
    >
      <button
        onClick={handleClick}
        className={'AffiliatLink instacart instacart-new-button'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          backgroundColor: '#003D29',
          color: '#FAF1E5',
          padding: '16px 18px',
          cursor: loading ? 'not-allowed' : 'pointer',
          height: '46px',
          borderRadius: '8px',
          border: 'none',
          fontFamily: 'inherit',
          fontSize: '14px',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          transition: 'opacity 0.2s',
        }}
        disabled={loading}
      >
        {loading ? (
          <Icon style={{ color: '#FAF1E5' }} type="loading" />
        ) : (
          <>
            <img
              className={'instacart-logo'}
              src={'/images/Instacart-logo.svg'}
              alt="Instacart logo"
              style={{ height: '22px', width: 'auto' }}
            />
            <span>Get Recipe Ingredients</span>
          </>
        )}
      </button>
      {withDisclamer && <EarnsCommissionsOnPurchases />}
    </div>
  ) : (
    <div style={{ display: inlineFlex ? 'inline-flex' : 'flex', flexDirection: 'column' }}>
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
  // containerClassName: PropTypes.string,
  isProduct: PropTypes.bool,
  withDisclamer: PropTypes.bool,
  marginBottom: PropTypes.string,
  inlineFlex: PropTypes.bool,
};

export default InstacartWidget;
