import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Icon, Input, Modal, message } from 'antd';
import IconButton from '../../components/IconButton';
import { getAppendData } from '../../helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../reducers';
import { appendObject } from '../appendActions';
import './AddItemModal.less';

@connect(
  state => ({
    currentUserName: getAuthenticatedUserName(state),
  }),
  { appendObject },
)
@injectIntl
class AddItemModal extends Component {
  static defaultProps = {
    currentUserName: '',
    loading: false,
    appendObject: () => {},
  };

  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // passed props
    parent: PropTypes.string.isRequired,
    wobject: PropTypes.shape().isRequired,
    // from connect
    currentUserName: PropTypes.string,
    appendObject: PropTypes.func,
  };

  state = {
    isModalOpen: false,
    isLoading: false,
    inputValue: '',
  };

  handleInputChange = event => {
    const inputValue = event.target.value;
    this.setState({ inputValue });
  };

  handleToggleModal = () =>
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
      inputValue: prevState.isModalOpen ? '' : prevState.inputValue,
    }));

  handleSubmit = () => {
    const { inputValue } = this.state;
    const { currentUserName, wobject, parent, intl } = this.props;

    this.setState({ isLoading: true });
    const bodyMsg = intl.formatMessage(
      {
        id: 'add_catalog_item',
        defaultMessage: `@{currentUserName} added category <strong>{category}</strong> to catalog.`,
      },
      {
        user: currentUserName,
        category: inputValue,
      },
    );
    const fieldContent = {
      name: 'catalogItem',
      body: inputValue,
      parent,
      locale: 'en-US',
    };
    const appendData = getAppendData(currentUserName, wobject, bodyMsg, fieldContent);
    this.props
      .appendObject(appendData)
      .then(() => {
        this.setState({ isLoading: false });
        message.success(
          intl.formatMessage({
            id: 'notify_create_category',
            defaultMessage: 'Category has been created',
          }),
        );
        this.handleToggleModal();
      })
      .catch(err => {
        console.log('err > ', err);
        this.setState({ isLoading: false });
        message.error(
          intl.formatMessage({
            id: 'notify_create_category_error',
            defaultMessage: "Couldn't create category",
          }),
        );
        this.handleToggleModal();
      });
  };

  render() {
    const { isModalOpen, isLoading, inputValue } = this.state;
    const { intl } = this.props;

    return isModalOpen ? (
      <Modal
        title={intl.formatMessage({
          id: 'category_new',
          defaultMessage: 'New category',
        })}
        visible={isModalOpen}
        onCancel={this.handleToggleModal}
        width={500}
        footer={null}
        destroyOnClose
      >
        <div className="modal-content">
          <div className="modal-content__row align-center">
            <Input
              className="modal-content__name-input"
              placeholder={intl.formatMessage({
                id: 'category_name',
                defaultMessage: 'Category name',
              })}
              value={inputValue}
              onChange={this.handleInputChange}
              onPressEnter={this.handleSubmit}
            />
          </div>
          <div className="modal-content__row align-right">
            <Button
              className="modal-content__submit-btn"
              type="primary"
              loading={isLoading}
              disabled={isLoading}
              onClick={this.handleSubmit}
            >
              {intl.formatMessage({
                id: isLoading ? 'post_send_progress' : 'create',
                defaultMessage: isLoading ? 'Submitting' : 'Create',
              })}
            </Button>
          </div>
        </div>
      </Modal>
    ) : (
      <IconButton
        icon={<Icon type="plus-circle" />}
        onClick={this.handleToggleModal}
        caption={intl.formatMessage({ id: 'category', defaultMessage: 'Category' })}
      />
    );
  }
}

export default AddItemModal;
