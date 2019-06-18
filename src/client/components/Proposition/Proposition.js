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
      linkTo,
      fieldName,
      objectID,
      objName,
      handleSelectField,
      selectedField,
    } = this.props;
    const { showModal } = this.state;
    const linkPath = linkTo || `/object/${objectID}/updates/${fieldName}`;

    const linkClass = cn({
      'icon-button__text': true,
      'field-selected': selectedField === fieldName,
    });

    return (
      <React.Fragment>
        <div className="proposition-line">
          <Link to={{ pathname: linkPath }} data-test={`${fieldName}-plus-button`}>
            <IconButton icon={<Icon type="plus-circle" />} onClick={this.handleToggleModal} />
          </Link>
          <div className={linkClass} data-test={`${fieldName}-field-name`}>
            <Link to={linkPath} onClick={() => handleSelectField(fieldName)}>
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
  objectID: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
  handleSelectField: PropTypes.func,
  selectedField: PropTypes.string,
  linkTo: PropTypes.string,
};

Proposition.defaultProps = {
  fieldName: 'name',
  handleSelectField: () => {},
  selectedField: '',
  linkTo: '',
};

export default injectIntl(Proposition);
