import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import './Proposition.less';
import AppendModal from '../../object/AppendModal';
import IconButton from '../IconButton';

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
          <Link to={{ pathname: `/object/@${objectID}/updates/${fieldName}` }}>
            <IconButton
              icon={<Icon type="plus-circle" />}
              onClick={this.handleToggleModal}
              caption={intl.formatMessage({
                id: `object_field_${fieldName}`,
                defaultMessage: fieldName,
              })}
            />
          </Link>
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
