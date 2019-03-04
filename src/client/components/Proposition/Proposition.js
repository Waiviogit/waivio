import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import cn from 'classnames';
import './Proposition.less';
import AppendModal from '../../object/AppendModal';
import IconButton from '../IconButton';

class Proposition extends React.Component {
  state = {
    showModal: false,
  };

  handleToggleModal = () => this.setState({ showModal: !this.state.showModal });

  render() {
    const {
      intl,
      fieldName,
      objectID,
      objName,
      objType,
      handleSelectField,
      selectedField,
    } = this.props;
    const { showModal } = this.state;

    const linkClass = cn({
      'icon-button__text': true,
      'field-selected': selectedField === fieldName,
    });

    return (
      <React.Fragment>
        <div className="proposition-line">
          <Link to={{ pathname: `/object/${objectID}/updates/${fieldName}` }}>
            <IconButton icon={<Icon type="plus-circle" />} onClick={this.handleToggleModal} />
          </Link>
          <div className={linkClass}>
            <Link
              to={`/object/${objectID}/updates/${fieldName}`}
              onClick={() => handleSelectField(fieldName)}
            >
              {intl.formatMessage({
                id: `object_field_${fieldName}`,
                defaultMessage: fieldName,
              })}
            </Link>
          </div>
        </div>
        {showModal && (
          <AppendModal
            objName={objName}
            objType={objType}
            showModal={showModal}
            hideModal={this.handleToggleModal}
            locale={'en-US'}
            field={fieldName}
          />
        )}
      </React.Fragment>
    );
  }
}
Proposition.propTypes = {
  objName: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  objType: PropTypes.string.isRequired,
  objectID: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
  handleSelectField: PropTypes.func,
  selectedField: PropTypes.string,
};

Proposition.defaultProps = {
  fieldName: 'name',
  handleSelectField: () => {},
  selectedField: '',
};

export default injectIntl(Proposition);
