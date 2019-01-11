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
    const { intl, fieldName, objectID, defaultName } = this.props;
    const { showModal } = this.state;
    return (
      <React.Fragment>
        <Link
          to={{ pathname: `/object/${objectID}/${defaultName}/history/${fieldName}` }}
          onClick={this.handleToggleModal}
        >
          <div className="proposition-line">
            <Icon type="plus-circle" className="proposition-line__icon" />
            <span className="proposition-line__text">
              {`${intl.formatMessage({
                id: 'there_may_be',
                defaultMessage: 'There may be',
              })} ${intl
                .formatMessage({
                  id: `object_field_${fieldName}`,
                  defaultMessage: fieldName,
                })
                .toLowerCase()}`}
            </span>
          </div>
        </Link>
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
  defaultName: PropTypes.string.isRequired,
  objectID: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
};

Proposition.defaultProps = {
  fieldName: 'name',
  defaultName: 'abc',
};

export default injectIntl(Proposition);
