import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Tag } from 'antd';
import './ObjectRank.less';

const ObjectRank = ({ rank }) =>
  rank && (
    <div className="ObjectRank">
      <FormattedMessage id="rank" defaultMessage="Rank:" />
      <Tag>{rank}</Tag>
    </div>
  );

ObjectRank.propTypes = {
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ObjectRank.defaultProps = {
  rank: '',
};

export default ObjectRank;
