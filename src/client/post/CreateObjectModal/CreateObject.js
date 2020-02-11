import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Form, Input, Select, Button, Modal } from 'antd';
import { connect } from 'react-redux';
import LANGUAGES from '../../translations/languages';
import { getLanguageText } from '../../translations';
import { objectFields } from '../../../common/constants/listOfFields';
import LikeSection from '../../object/LikeSection';
import FollowObjectForm from '../../object/FollowObjectForm';
import { getSuitableLanguage, getObjectTypesList } from '../../reducers';
import { notify } from '../../app/Notification/notificationActions';
import { getObjectTypes } from '../../objectTypes/objectTypesActions';
import { createWaivioObject } from '../../object/wobjectsActions';
import DEFAULTS from '../../object/const/defaultValues';
import './CreateObject.less';

@injectIntl
@Form.create()
@connect(
  state => ({
    objectTypes: getObjectTypesList(state),
    locale: getSuitableLanguage(state),
  }),
  {
    createWaivioObject,
    getObjectTypes,
    notify,
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
    createWaivioObject: PropTypes.func.isRequired,
    getObjectTypes: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    /* passed props */
    isSingleType: PropTypes.bool,
    isModalOpen: PropTypes.bool,
    defaultObjectType: PropTypes.string,
    withOpenModalBtn: PropTypes.bool,
    openModalBtnText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    onCreateObject: PropTypes.func,
    onCloseModal: PropTypes.func,
  };

  static defaultProps = {
    objectTypes: {},
    locale: 'en-US',
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
      if (!this.state.isModalOpen && _.isEmpty(this.props.objectTypes)) this.props.getObjectTypes();
      this.setState({ isModalOpen: !this.state.isModalOpen });
    }
  };

  handleVotePercentChange = votePercent => this.setState({ votePercent });

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
        this.props
          .createWaivioObject(objData)
          .then(({ value: { parentPermlink, parentAuthor } }) => {
            this.props.notify(
              this.props.intl.formatMessage({
                id: 'create_object_success',
                defaultMessage: 'Object has been created',
              }),
              'success',
            );
            this.setState({ loading: false, isModalOpen: false });
            this.props.onCreateObject({
              id: parentPermlink,
              author: parentAuthor,
              avatar: DEFAULTS.AVATAR,
              name: objData.name,
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
              type: objData.type,
              background: '',
            });
          })
          .catch(() => {
            this.props.notify(
              this.props.intl.formatMessage({
                id: 'create_object_error',
                defaultMessage: 'Something went wrong. Object is not created',
              }),
              'error',
            );
            this.setState({ loading: false, isModalOpen: false });
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
                  defaultMessage: 'create new topic',
                })}
            </div>
          </div>
        )}

        {this.state.isModalOpen && (
          <Modal
            title={this.props.intl.formatMessage({
              id: 'create_new_object',
              defaultMessage: 'Create new topic',
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
                    required: true,
                    message: intl.formatMessage({
                      id: 'name_required',
                      defaultMessage: 'Please enter name for new topic',
                    }),
                  },
                ],
              })(
                <Input
                  disabled={loading}
                  className="Editor__title"
                  placeholder={intl.formatMessage({
                    id: 'value_placeholder',
                    defaultMessage: 'Topic name',
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
                <Select disabled={loading} style={{ width: '100%' }}>
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
                      defaultMessage: 'Please select topic type!',
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
                  {_.map(objectTypes, type => (
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
