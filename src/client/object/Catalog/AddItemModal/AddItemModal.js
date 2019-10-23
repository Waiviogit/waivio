import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Modal, message, Select, Form } from 'antd';
import _ from 'lodash';
import { getAppendData } from '../../../helpers/wObjectHelper';
import { getFieldWithMaxWeight } from '../../../object/wObjectHelper';
import {
  getAuthenticatedUserName,
  getFollowingObjectsList,
  getSuitableLanguage,
} from '../../../reducers';
import { appendObject } from '../../appendActions';
import { objectFields } from '../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';
import LikeSection from '../../../object/LikeSection';
import LANGUAGES from '../../../translations/languages';
import { getLanguageText } from '../../../translations';
import FollowObjectForm from '../../FollowObjectForm';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import apiConfig from '../../../../waivioApi/config.json';
import './AddItemModal.less';

@connect(
  state => ({
    currentUserName: getAuthenticatedUserName(state),
    locale: getSuitableLanguage(state),
    followingList: getFollowingObjectsList(state),
  }),
  {
    appendObject,
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
        const langReadable = _.filter(LANGUAGES, { id: values.locale })[0].name;
        const objectUrl = `${apiConfig.production.protocol}${apiConfig.production.host}/object/${selectedItem.id}`;
        const bodyMsg = `@${currentUserName} added list-item (${langReadable}):\n[${selectedItem.name} (type: ${selectedItem.type})](${objectUrl})`;
        const fieldContent = {
          name: 'listItem',
          body: selectedItem.id,
          locale: values.locale,
        };

        const appendData = getAppendData(currentUserName, wobject, bodyMsg, fieldContent);

        this.props
          .appendObject(appendData, { votePower: votePercent * 100, follow: values.follow })
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

  handleCreateObject = wobj => this.handleObjectSelect(wobj);

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
            closable
            onCancel={this.handleToggleModal}
            maskClosable={false}
            visible={isModalOpen}
            wrapClassName="add-item-modal"
            width={700}
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
                    // onChange={this.handleLanguageChange}
                    disabled={isLoading}
                  >
                    {languageOptions}
                  </Select>,
                )}
              </Form.Item>
              <ObjectCardView wObject={selectedItem} />
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
        <CreateObject onCreateObject={this.handleCreateObject} />
      </React.Fragment>
    );
  }
}

export default AddItemModal;
