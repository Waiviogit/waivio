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
  containerClassName,
  withDisclamer,
  marginBottom,
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
    <span className={containerClassName}>
      <button
        onClick={handleClick}
        className={'AffiliatLink instacart'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#2b8a3e',
          padding: '12px 20px',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '122px',
          height: '60px',
        }}
      >
        {loading ? (
          <Icon style={{ color: 'white' }} type="loading" />
        ) : (
          <img
            className={'instacart'}
            src={'/images/Instacart-logo.svg'}
            alt="Instacart logo"
            style={{ height: '13px' }}
          />
        )}
      </button>
    </span>
  ) : (
    <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
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
  containerClassName: PropTypes.string,
  isProduct: PropTypes.bool,
  withDisclamer: PropTypes.bool,
  marginBottom: PropTypes.string,
};

export default InstacartWidget;
