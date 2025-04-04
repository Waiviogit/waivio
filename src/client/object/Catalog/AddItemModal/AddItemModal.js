import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Modal, message, Select, Form } from 'antd';
import { filter, isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import { getAppendData, getObjectName } from '../../../../common/helpers/wObjectHelper';
import { getSuitableLanguage } from '../../../../store/reducers';
import { appendObject, voteAppends } from '../../../../store/appendStore/appendActions';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';
import LikeSection from '../../../object/LikeSection';
import LANGUAGES from '../../../../common/translations/languages';
import { getLanguageText } from '../../../../common/translations';
import FollowObjectForm from '../../FollowObjectForm';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import apiConfig from '../../../../waivioApi/config.json';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { getFollowingObjectsList } from '../../../../store/userStore/userSelectors';
import { getUpdatesList } from '../../../../waivioApi/ApiClient';

import './AddItemModal.less';

@connect(
  state => ({
    currentUserName: getAuthenticatedUserName(state),
    locale: getSuitableLanguage(state),
    followingList: getFollowingObjectsList(state),
  }),
  {
    appendObject,
    voteAppends,
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
    addedItemsPermlinks: [],
    onAddItem: () => {},
  };

  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    wobject: PropTypes.shape().isRequired,
    itemsIdsToOmit: PropTypes.arrayOf(PropTypes.string),
    onAddItem: PropTypes.func,
    currentUserName: PropTypes.string,
    locale: PropTypes.string,
    followingList: PropTypes.arrayOf(PropTypes.string),
    addedItemsPermlinks: PropTypes.arrayOf(PropTypes.string),
    appendObject: PropTypes.func.isRequired,
    voteAppends: PropTypes.func.isRequired,
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

  handleSubmit = async createdObjectValues => {
    const { votePercent, selectedItem, isModalOpen } = this.state;
    const { currentUserName, wobject, intl, form } = this.props;
    const listItemsUpdates = await getUpdatesList(wobject.author_permlink, 0, { type: 'listItem' });

    const dup = listItemsUpdates?.fields.find(
      field => field.body === selectedItem?.author_permlink,
    );

    form.validateFields((err, values) => {
      const isManualSelected = isModalOpen && !isEmpty(values);
      const objectValues = isManualSelected ? values : createdObjectValues;

      if (!err && !this.state.isLoading) {
        this.setState({ isLoading: true });
        const langReadable = filter(LANGUAGES, { id: objectValues.locale })[0].name;
        const objectUrl = `${apiConfig.production.protocol}${apiConfig.production.host}/object/${selectedItem.author_permlink}`;
        const bodyMsg = `@${currentUserName} added list-item (${langReadable}):\n[${getObjectName(
          selectedItem,
        )} (type: ${selectedItem.object_type || selectedItem.type})](${objectUrl})`;
        const fieldContent = {
          name: 'listItem',
          body: selectedItem.author_permlink,
          locale: objectValues.locale,
        };
        const userUpVotePower = 100;
        const appendData = getAppendData(currentUserName, wobject, bodyMsg, fieldContent);
        const appendAction = () =>
          dup
            ? this.props.voteAppends(dup.author, dup.permlink, userUpVotePower, currentUserName)
            : this.props.appendObject(appendData, {
                votePercent: isManualSelected
                  ? Number(
                      BigNumber(votePercent)
                        .multipliedBy(100)
                        .toFixed(0),
                    )
                  : createdObjectValues?.votePercent,
                follow: objectValues.follow,
                isLike: true,
              });

        appendAction()
          .then(() => {
            this.setState({ isLoading: false });
            message.success(
              intl.formatMessage({
                id: 'notify_add_list_item',
                defaultMessage: 'List item successfully has been added',
              }),
            );
            this.props.onAddItem(selectedItem);
            if (isManualSelected) {
              this.handleToggleModal();
            }
          })
          .catch(() => {
            this.setState({ isLoading: false });
            message.error(
              intl.formatMessage({
                id: 'notify_add_list_item_error',
                defaultMessage: "Couldn't add list item",
              }),
            );
            if (isManualSelected) {
              this.handleToggleModal();
            }
          });
      }
    });
  };

  handleCreateObject = (wobj, { locale = 'en-US', votePercent }) => {
    this.setState({ selectedItem: wobj });
    this.handleSubmit({ locale, follow: false, votePercent });
  };

  render() {
    const { isModalOpen, isLoading, selectedItem, littleVotePower } = this.state;
    const { intl, wobject, itemsIdsToOmit, form, followingList, addedItemsPermlinks } = this.props;
    const { getFieldDecorator } = form;
    const listName = getObjectName(wobject);
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
                selectedType={selectedItem}
                setLittleVotePower={value =>
                  this.setState({
                    littleVotePower: value,
                  })
                }
              />

              {followingList.includes(wobject.author_permlink) ? null : (
                <FollowObjectForm loading={isLoading} form={form} />
              )}

              <div className="modal-content__row align-right">
                <Button
                  className="modal-content__submit-btn"
                  type="primary"
                  loading={isLoading}
                  disabled={littleVotePower || isLoading}
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
          useExtendedSearch
          addedItemsPermlinks={addedItemsPermlinks}
          handleSelect={this.handleObjectSelect}
          itemsIdsToOmit={itemsIdsToOmit}
          parentObject={wobject}
        />
        <CreateObject
          onCreateObject={this.handleCreateObject}
          parentObject={wobject.parent || wobject || {}}
        />{' '}
      </React.Fragment>
    );
  }
}

export default AddItemModal;
