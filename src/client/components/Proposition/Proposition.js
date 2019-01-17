import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import './Proposition.less';
import AppendModal from '../../object/AppendModal';

class Proposition extends React.Component {
  state = {
    showModal: false,
  };
  handleToggleModal = () => this.setState({ showModal: !this.state.showModal });

  render() {
    const { intl, fieldName, objectID } = this.props;
    const { showModal } = this.state;
    return (
      <React.Fragment>
        <div className="proposition-line">
          <Link
            to={{ pathname: `/object/@${objectID}/updates/${fieldName}` }}
            onClick={this.handleToggleModal}
          >
            <Icon type="plus-circle" className="proposition-line__icon" />
          </Link>
          <span className="proposition-line__text">
            {intl.formatMessage({
              id: `object_field_${fieldName}`,
              defaultMessage: fieldName,
            })}
          </span>
        </div>
        <AppendModal
          showModal={showModal}
          hideModal={this.handleToggleModal}
          locale={'en-US'}
          field={fieldName}
        />
      </React.Fragment>
    );
  }
}
Proposition.propTypes = {
  fieldName: PropTypes.string.isRequired,
  objectID: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
};

Proposition.defaultProps = {
  fieldName: 'name',
};

export default injectIntl(Proposition);
