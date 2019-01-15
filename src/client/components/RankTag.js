import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Tag } from 'antd';
import './RankTag.less';

function RankTag({ intl, rank }) {
  return <Tag>{intl.formatMessage({ id: 'rank', defaultMessage: 'Rank: {rank}' }, { rank })}</Tag>;
}

RankTag.propTypes = {
  intl: PropTypes.shape().isRequired,
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default injectIntl(RankTag);
