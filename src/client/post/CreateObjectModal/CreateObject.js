import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Form, Input, Select, Button, Modal } from 'antd';
import { isEmpty, map, get } from 'lodash';
import { withRouter } from 'react-router';

import LANGUAGES from '../../translations/languages';
import { getLanguageText } from '../../translations';
import { objectFields } from '../../../common/constants/listOfFields';
import listofObjTypesWithAlbum from '../../../common/constants/listofObjTypesWithAlbum';
import LikeSection from '../../object/LikeSection';
import FollowObjectForm from '../../object/FollowObjectForm';
import { getSuitableLanguage } from '../../store/reducers';
import { notify } from '../../app/Notification/notificationActions';
import { getObjectTypes } from '../../store/objectTypesStore/objectTypesActions';
import { appendObject } from '../../store/appendStore/appendActions';
import { createWaivioObject } from '../../store/wObjectStore/wobjectsActions';
import { addAlbumToStore } from '../../store/galleryStore/galleryActions';
import DEFAULTS from '../../object/const/defaultValues';
import { getAppendData, prepareAlbumData, prepareAlbumToStore } from '../../helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';
import { getObjectTypesList } from '../../store/objectTypesStore/objectTypesSelectors';

import './CreateObject.less';

@injectIntl
@withRouter
@Form.create()
@connect(
  state => ({
    username: getAuthenticatedUserName(state),
    objectTypes: getObjectTypesList(state),
    locale: getSuitableLanguage(state),
  }),
  {
    appendObject,
    createWaivioObject,
    getObjectTypes,
    notify,
    addAlbumToStore,
  },
)
class CreateObject extends React.Component {
  static propTypes = {
    /* from decorators */
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    /* from connect */
    objectTypes: PropTypes.shape(),
    locale: PropTypes.string.isRequired,
    username: PropTypes.string,
    appendObject: PropTypes.func.isRequired,
    createWaivioObject: PropTypes.func.isRequired,
    getObjectTypes: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    /* passed props */
    isSingleType: PropTypes.bool,
    isModalOpen: PropTypes.bool,
    defaultObjectType: PropTypes.string,
    parentObject: PropTypes.shape(),
    withOpenModalBtn: PropTypes.bool,
    openModalBtnText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    onCreateObject: PropTypes.func,
    onCloseModal: PropTypes.func,
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
    addAlbumToStore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    objectTypes: {},
    locale: 'en-US',
    username: '',
    parentObject: {},
    withOpenModalBtn: true,
    isSingleType: false,
    isModalOpen: false,
    defaultObjectType: '',
    openModalBtnText: '',
    onCreateObject: () => {},
    onCloseModal: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      loading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isModalOpen !== nextProps.isModalOpen) {
      this.setState({ isModalOpen: nextProps.isModalOpen });
    }
  }

  handleCloseModal = () => {
    this.props.onCloseModal();
    this.toggleModal();
  };

  toggleModal = () => {
    if (!this.state.loading) {
      if (!this.state.isModalOpen && isEmpty(this.props.objectTypes)) this.props.getObjectTypes();
      this.setState({ isModalOpen: !this.state.isModalOpen });
    }
  };

  handleVotePercentChange = votePercent => this.setState({ votePercent });

  forceCloseObject = () =>
    this.setState({ loading: false, isModalOpen: false }, () => {
      this.handleCloseModal();
    });

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err && !this.state.loading) {
        const selectedType = this.props.objectTypes[values.type];

        this.setState({ loading: true });
        const objData = {
          ...values,
          id: values.name,
          type: values.type.toLowerCase(),
          isExtendingOpen: true,
          isPostingOpen: true,
          votePower: this.state.votePercent * 100,
          parentAuthor: selectedType.author,
          parentPermlink: selectedType.permlink,
        };
        const parentObject =
          get(this.props.parentObject, 'parent.author_permlink') ||
          get(this.props.parentObject, 'author_permlink');

        this.props
          .createWaivioObject(objData)
          .then(({ value: { parentPermlink, parentAuthor } }) => {
            // add parent to created object
            if (!isEmpty(this.props.parentObject)) {
              this.props.appendObject(
                getAppendData(
                  this.props.username,
                  {
                    id: parentPermlink,
                    author: parentAuthor,
                    creator: this.props.username,
                    name: values.name,
                    locale: values.locale,
                    author_permlink: parentPermlink,
                  },
                  '',
                  {
                    name: objectFields.parent,
                    body: parentObject,
                    locale: values.locale,
                  },
                ),
                { votePower: null, follow: false, isLike: false },
              );
            }
            const isObjType = type => listofObjTypesWithAlbum.some(item => item === type);

            if (isObjType(objData.type)) {
              const formData = {
                galleryAlbum: 'Photos',
              };
              const data = prepareAlbumData(formData, this.props.username, {
                author: parentAuthor,
                author_permlink: parentPermlink,
              });
              const album = prepareAlbumToStore(data);

              const { author } = this.props.appendObject(data);

              this.props.addAlbumToStore({ ...album, author });
            }
            this.props.notify(
              this.props.intl.formatMessage({
                id: 'create_object_success',
                defaultMessage: 'Object has been created',
              }),
              'success',
            );
            this.props.onCreateObject(
              {
                id: parentPermlink,
                author: parentAuthor,
                avatar: DEFAULTS.AVATAR,
                name: objData.name,
                title: '',
                parent: this.props.parentObject,
                weight: '',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                children: [],
                users: [],
                userCount: 0,
                version: 0,
                isNew: false,
                rank: 1,
                type: objData.type,
                background: '',
                author_permlink: parentPermlink,
              },
              { locale: values.locale },
            );
            this.forceCloseObject();
          })
          .catch(error => {
            this.props.notify(
              this.props.intl.formatMessage({
                id: error,
                defaultMessage: 'Something went wrong. Object is not created',
              }),
              'error',
            );
            this.forceCloseObject();
          });
      }
    });
  };

  render() {
    const languageOptions = [];
    const { getFieldDecorator } = this.props.form;
    const {
      locale,
      intl,
      form,
      objectTypes,
      withOpenModalBtn,
      openModalBtnText,
      defaultObjectType,
      isSingleType,
    } = this.props;
    const { loading } = this.state;
    const Option = Select.Option;

    LANGUAGES.forEach(lang => {
      languageOptions.push(
        <Option key={lang.id} value={lang.id}>
          {getLanguageText(lang)}
        </Option>,
      );
    });

    return (
      <React.Fragment>
        {withOpenModalBtn && (
          <div className="CreateObject__row align-right">
            <div role="presentation" className="CreateObject__button" onClick={this.toggleModal}>
              {openModalBtnText ||
                this.props.intl.formatMessage({
                  id: 'create_new_object',
                  defaultMessage: 'create new object',
                })}
            </div>
          </div>
        )}

        {this.state.isModalOpen && (
          <Modal
            title={this.props.intl.formatMessage({
              id: 'create_new_object',
              defaultMessage: 'Create new object',
            })}
            closable
            onCancel={this.handleCloseModal}
            maskClosable={false}
            visible={this.state.isModalOpen}
            wrapClassName="create-object-modal"
            confirmLoading={this.state.isCreating}
            footer={null}
          >
            <Form.Item>
              {getFieldDecorator(objectFields.name, {
                getValueFromEvent:
                  defaultObjectType === 'hashtag' ? e => e.target.value.toLowerCase() : null,
                initialValue: '',
                rules: [
                  {
                    max: 100,
                    message: intl.formatMessage(
                      {
                        id: 'value_error_long',
                        defaultMessage: "Name can't be longer than 100 characters.",
                      },
                      { value: 100 },
                    ),
                  },
                  {
                    pattern: defaultObjectType === 'hashtag' ? /^[a-z0-9_.-]*$/ : null,
                    message: intl.formatMessage({
                      id: 'value_error_upper_case',
                      defaultMessage:
                        'Lowercase letters, numbers, period, underscore and hyphen are allowed',
                    }),
                  },
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'name_required',
                      defaultMessage: 'Please enter name for new object',
                    }),
                  },
                ],
              })(
                <Input
                  disabled={loading}
                  className="Editor__title"
                  placeholder={intl.formatMessage({
                    id: 'value_placeholder',
                    defaultMessage: 'Add value',
                  })}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('locale', {
                initialValue: locale,
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
                <Select disabled={loading} style={{ width: '100%' }} className="languageOptions">
                  {languageOptions}
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('type', {
                initialValue: defaultObjectType,
                rules: [
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'validation_object_type',
                      defaultMessage: 'Please select object type!',
                    }),
                  },
                ],
              })(
                <Select
                  showSearch
                  disabled={isSingleType}
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({
                    id: 'placeholder_obj_type',
                    defaultMessage: 'Object type',
                  })}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {map(objectTypes, type => (
                    <Option value={type.name} key={type.name}>
                      {type.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <LikeSection
              form={form}
              onVotePercentChange={this.handleVotePercentChange}
              disabled={loading}
            />
            <FollowObjectForm form={form} loading={loading} />
            <Form.Item className="Editor__bottom__submit">
              <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}>
                {intl.formatMessage({ id: 'confirm', defaultMessage: 'Confirm' })}
              </Button>
            </Form.Item>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default CreateObject;
