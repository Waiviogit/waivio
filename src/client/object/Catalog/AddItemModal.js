import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Icon, Input, Modal } from 'antd';
import IconButton from '../../components/IconButton';
import './AddItemModal.less';

class AddItemModal extends Component {
  static defaultProps = {
    loading: false,
    onSubmit: () => {},
  };

  static propTypes = {
    intl: PropTypes.shape().isRequired,
    loading: PropTypes.bool,
    // onSubmit: PropTypes.func,
  };

  state = {
    isModalOpen: false,
  };

  handleToggleModal = () =>
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
    }));

  handleSubmit = () => this.handleToggleModal();

  render() {
    const { isModalOpen } = this.state;
    const { intl, loading } = this.props;

    return isModalOpen ? (
      <Modal
        title={intl.formatMessage({
          id: 'add_new_item',
          defaultMessage: 'Add new item',
        })}
        visible={isModalOpen}
        onCancel={this.handleToggleModal}
        width={500}
        footer={null}
        destroyOnClose
      >
        <div className="modal-content">
          <div className="modal-content__row align-center">
            <Input className="modal-content__name-input" />
          </div>
          <div className="modal-content__row align-right">
            <Button
              className="modal-content__submit-btn"
              type="primary"
              loading={loading}
              disabled={loading}
              onClick={this.handleSubmit}
            >
              {intl.formatMessage({
                id: loading ? 'post_send_progress' : 'create',
                defaultMessage: loading ? 'Submitting' : 'Create',
              })}
            </Button>
          </div>
        </div>
      </Modal>
    ) : (
      <IconButton
        icon={<Icon type="plus-circle" />}
        onClick={this.handleToggleModal}
        caption={intl.formatMessage({ id: 'add_new_item', defaultMessage: 'Add new item' })}
        // caption={<FormattedMessage id="add_new_item" defaultMessage="Add new item" />}
      />
    );
  }
}

export default injectIntl(AddItemModal);
