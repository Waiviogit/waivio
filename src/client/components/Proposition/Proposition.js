import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import './Proposition.less';

const Proposition = ({ intl, fieldName, objectID }) => (
  <Link to={{ pathname: `/wobject/editor/@${objectID}/${fieldName}` }}>
    <div className="proposition-line">
      <Icon type="plus-circle" className="proposition-line__icon" />
      <span className="proposition-line__text">
        {`${intl.formatMessage({
          id: 'there_may_be',
          defaultMessage: 'There may be',
        })} ${fieldName}`}
      </span>
    </div>
  </Link>
);

Proposition.propTypes = {
  fieldName: PropTypes.string.isRequired,
  objectID: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
};

Proposition.defaultProps = {
  fieldName: 'name',
};

export default injectIntl(Proposition);
