import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Modal, message, Select, Form } from 'antd';
import { getAppendData } from '../../../helpers/wObjectHelper';
import { getFieldWithMaxWeight } from '../../../object/wObjectHelper';
import { getAuthenticatedUserName, getFollowingObjectsList, getLocale } from '../../../reducers';
import { appendObject } from '../../appendActions';
import { objectFields } from '../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import CreateObjectModal from '../../../post/CreateObjectModal/CreateObject';
import LikeSection from '../../../object/LikeSection';
import LANGUAGES from '../../../translations/languages';
import { getLanguageText } from '../../../translations';
import ListItem from '../CatalogItem';
import FollowObjectForm from '../../FollowObjectForm';
import { followObject } from '../../../object/wobjActions';
import * as wobjectActions from '../../wobjectsActions';
import * as notificationActions from '../../../app/Notification/notificationActions';
import './AddItemModal.less';

@connect(
  state => ({
    currentUserName: getAuthenticatedUserName(state),
    locale: getLocale(state),
    followingList: getFollowingObjectsList(state),
  }),
  {
    appendObject,
    followObject,
    createObject: wobjectActions.createWaivioObject,
    notify: notificationActions.notify,
  },
)
@injectIntl
@Form.create()
class AddItemModal extends Component {
  static defaultProps = {
    currentUserName: '',
    locale: 'en-US',
    loading: false,
    wobject: {},
    followingList: [],
    itemsIdsToOmit: [],
    onAddItem: () => {},
  };

  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    // passed props
    wobject: PropTypes.shape().isRequired,
    itemsIdsToOmit: PropTypes.arrayOf(PropTypes.string),
    onAddItem: PropTypes.func,
    // from connect
    currentUserName: PropTypes.string,
    locale: PropTypes.string,
    followingList: PropTypes.arrayOf(PropTypes.string),
    appendObject: PropTypes.func.isRequired,
    followObject: PropTypes.func.isRequired,
    createObject: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isLoading: false,
      selectedItem: null,
    };
  }

  handleToggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

  handleObjectSelect = selectedItem => {
    this.setState({ selectedItem, isModalOpen: true });
  };

  handleVotePercentChange = votePercent => this.setState({ votePercent });

  handleSubmit = () => {
    const { votePercent, selectedItem } = this.state;
    const { currentUserName, wobject, intl, form } = this.props;

    form.validateFields((err, values) => {
      if (!err && !this.state.isLoading) {
        this.setState({ isLoading: true });
        const bodyMsg = intl.formatMessage(
          {
            id: 'add_list_item',
            defaultMessage: `@{user} added {itemType} <strong>{itemValue}</strong> to the list.`,
          },
          {
            user: currentUserName,
            itemType: selectedItem.type === 'listItem' ? 'list-item' : 'object',
            itemValue: selectedItem.name,
          },
        );
        const fieldContent = {
          name: 'listItem',
          body: selectedItem.id,
          locale: values.locale,
        };

        const appendData = getAppendData(currentUserName, wobject, bodyMsg, fieldContent);

        this.props
          .appendObject({ ...appendData, votePower: votePercent * 100 })
          .then(() => {
            if (form.getFieldValue('follow')) {
              return this.props.followObject(wobject.author_permlink);
            }
            return Promise.resolve();
          })
          .then(() => {
            this.setState({ isLoading: false });
            message.success(
              intl.formatMessage({
                id: 'notify_add_list_item',
                defaultMessage: 'List item successfully has been added',
              }),
            );
            this.props.onAddItem(selectedItem);
            this.handleToggleModal();
          })
          .catch(error => {
            console.log('err > ', error);
            this.setState({ isLoading: false });
            message.error(
              intl.formatMessage({
                id: 'notify_add_list_item_error',
                defaultMessage: "Couldn't add list item",
              }),
            );
            this.handleToggleModal();
          });
      }
    });
  };

  handleCreateObject = (wobj, follow) => {
    const { intl, notify, createObject } = this.props;
    createObject(wobj, follow)
      .then(({ value: { objectPermlink, objectAuthor } }) => {
        notify(
          intl.formatMessage({
            id: 'create_object_success',
            defaultMessage: 'Object has been created',
          }),
          'success',
        );
        this.handleObjectSelect({
          id: objectPermlink,
          author: objectAuthor,
          avatar: '/images/logo-brand.png',
          name: wobj.name,
          title: '',
          parents: [],
          weight: '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          children: [],
          users: [],
          userCount: 0,
          version: 0,
          isNew: false,
          rank: 1,
          type: wobj.type,
          background: '',
        });
      })
      .catch(() =>
        notify(
          intl.formatMessage({
            id: 'create_object_error',
            defaultMessage: 'Something went wrong. Object is not created',
          }),
          'error',
        ),
      );
  };

  render() {
    const { isModalOpen, isLoading, selectedItem } = this.state;
    const { intl, wobject, itemsIdsToOmit, form, followingList } = this.props;
    const { getFieldDecorator } = form;

    const listName = getFieldWithMaxWeight(wobject, objectFields.name);
    const itemType = ['list'].includes(selectedItem && selectedItem.type)
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
              <Form.Item>
                {getFieldDecorator('locale', {
                  initialValue: this.props.locale,
                  rules: [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'validation_locale',
                        defaultMessage: 'Please select your locale!',
                      }),
                    },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={intl.formatMessage({ id: 'language', defaultMessage: 'Language' })}
                    onChange={this.handleLanguageChange}
                    disabled={isLoading}
                  >
                    {languageOptions}
                  </Select>,
                )}
              </Form.Item>
              <ListItem wobject={selectedItem} />
              <LikeSection
                form={form}
                onVotePercentChange={this.handleVotePercentChange}
                disabled={isLoading}
              />

              {followingList.includes(wobject.author_permlink) ? null : (
                <FollowObjectForm loading={isLoading} form={form} />
              )}

              <div className="modal-content__row align-right">
                <Button
                  className="modal-content__submit-btn"
                  type="primary"
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={this.handleSubmit}
                >
                  {intl.formatMessage({
                    id: isLoading ? 'post_send_progress' : 'append_send',
                    defaultMessage: isLoading ? 'Submitting' : 'Submit',
                  })}
                </Button>
              </div>
            </div>
          </Modal>
        )}
        <div className="modal-content__row align-left tittle">
          {intl.formatMessage({ id: 'add_object', defaultMessage: 'Add object' })}
        </div>
        <SearchObjectsAutocomplete
          handleSelect={this.handleObjectSelect}
          itemsIdsToOmit={itemsIdsToOmit}
        />
        <CreateObjectModal onCreateObject={this.handleCreateObject} />
      </React.Fragment>
    );
  }
}

export default AddItemModal;
