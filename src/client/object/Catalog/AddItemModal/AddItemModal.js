import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Modal, message, Select } from 'antd';
import { getAppendData } from '../../../helpers/wObjectHelper';
import { getFieldWithMaxWeight } from '../../../object/wObjectHelper';
import { getAuthenticatedUserName, getLocale } from '../../../reducers';
import { appendObject } from '../../appendActions';
import { objectFields } from '../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import LANGUAGES from '../../../translations/languages';
import { getLanguageText } from '../../../translations';
import './AddItemModal.less';

@connect(
  state => ({
    currentUserName: getAuthenticatedUserName(state),
    locale: getLocale(state),
  }),
  { appendObject },
)
@injectIntl
class AddItemModal extends Component {
  static defaultProps = {
    currentUserName: '',
    locale: 'en-US',
    loading: false,
    appendObject: () => {},
  };

  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // passed props
    wobject: PropTypes.shape().isRequired,
    // from connect
    currentUserName: PropTypes.string,
    locale: PropTypes.string,
    appendObject: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isLoading: false,
      language: props.locale || 'en-US',
      selectedItem: null,
    };
  }

  handleLanguageChange = language => this.setState({ language });

  handleToggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

  handleObjectSelect = selectedItem => {
    this.setState({ selectedItem, isModalOpen: true });
  };

  handleSubmit = () => {
    const { inputValue, language } = this.state;
    const { currentUserName, wobject, intl } = this.props;

    this.setState({ isLoading: true });
    const bodyMsg = intl.formatMessage(
      {
        id: 'add_catalog_item',
        defaultMessage: `@{user} added {itemType} <strong>{itemValue}</strong> to catalog.`,
      },
      {
        user: currentUserName,
        itemType: 'category',
        itemValue: inputValue,
      },
    );
    const fieldContent = {
      name: 'listItem',
      body: inputValue,
      locale: language,
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
    const { isModalOpen, isLoading, language } = this.state;
    const { intl, wobject } = this.props;

    const listName = getFieldWithMaxWeight(wobject, objectFields.name);
    const itemType = ['catalog', 'list'].includes(wobject.object_type)
      ? intl.formatMessage({
          id: 'list',
          defaultMessage: 'List',
        })
      : intl.formatMessage({
          id: 'object',
          defaultMessage: 'Object',
        });
    const languageOptions = LANGUAGES.map(lang => (
      <Select.Option key={lang.id} value={lang.id}>
        {getLanguageText(lang)}
      </Select.Option>
    ));

    return (
      <React.Fragment>
        {isModalOpen && (
          <Modal
            title={intl.formatMessage({
              id: 'list_update',
              defaultMessage: 'Update list',
            })}
            visible={isModalOpen}
            onCancel={this.handleToggleModal}
            width={500}
            footer={null}
            destroyOnClose
          >
            <div className="modal-content">
              <div className="modal-content__row align-left">
                {`${intl.formatMessage({
                  id: 'suggestion_add_field',
                  defaultMessage: 'Update',
                })}: ${listName}`}
              </div>
              <div className="modal-content__row align-left">
                {`${intl.formatMessage({
                  id: 'add_new',
                  defaultMessage: 'Add new',
                })}: ${itemType}`}
              </div>
              <div className="modal-content__row">
                <Select
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({ id: 'language', defaultMessage: 'Language' })}
                  value={language}
                  onChange={this.handleLanguageChange}
                >
                  {languageOptions}
                </Select>
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
        )}
        <SearchObjectsAutocomplete handleSelect={this.handleObjectSelect} canCreateNewObject />
      </React.Fragment>
    );
  }
}

export default AddItemModal;
