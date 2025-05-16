import { Icon } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { getInstacartLink, websiteStatisticsAction } from '../../waivioApi/ApiClient';

import './AffiliatLinks/AffiliatLink.less';

const InstacartWidget = ({ wobjPerm }) => {
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

  return (
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
      }}
    >
      {loading ? (
        <Icon style={{ color: 'white' }} type="loading" />
      ) : (
        <img
          className={'instacart'}
          src={'/images/instacart-logo.svg'}
          alt="Instacart logo"
          style={{ height: '13px' }}
        />
      )}
    </button>
  );
};

InstacartWidget.propTypes = {
  wobjPerm: PropTypes.string,
};

export default InstacartWidget;
