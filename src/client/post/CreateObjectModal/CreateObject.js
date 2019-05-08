import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Form, Input, Select, Button, Modal } from 'antd';
import { connect } from 'react-redux';
import './CreateObject.less';
import LANGUAGES from '../../translations/languages';
import { getLanguageText } from '../../translations';
import { objectFields } from '../../../common/constants/listOfFields';
import LikeSection from '../../object/LikeSection';
import FollowObjectForm from '../../object/FollowObjectForm';
import { getobjectTypesState } from '../../reducers';
import { getObjectTypes } from '../../objectTypes/objectTypesActions';

@injectIntl
@Form.create()
@connect(
  state => ({
    objectTypes: getobjectTypesState(state),
  }),
  {
    getObjectTypes,
  },
)
class CreateObject extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    objectTypes: PropTypes.shape(),
    currentLocaleInList: PropTypes.shape().isRequired,
    chosenType: PropTypes.string,
    onCreateObject: PropTypes.func.isRequired,
    getObjectTypes: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentLocaleInList: { id: 'en-US', name: '', nativeName: '' },
    wobject: { tag: '' },
    objectTypes: {},
    chosenType: null,
    onCreateObject: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: Boolean(props.chosenType),
      loading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.chosenType !== nextProps.chosenType) {
      this.setState({ isModalOpen: Boolean(nextProps.chosenType) });
    }
  }

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
          .onCreateObject(objData)
          .then(() => this.setState({ loading: false, isModalOpen: false }));
      }
    });
  };

  render() {
    const languageOptions = [];
    const { getFieldDecorator } = this.props.form;
    const { currentLocaleInList, intl, form, objectTypes, chosenType } = this.props;
    const { loading } = this.state;

    const Option = Select.Option;

    if (currentLocaleInList === 'auto') {
      languageOptions.push(
        <Select.Option disabled key="auto" value="auto">
          {intl.formatMessage({ id: 'select_language', defaultMessage: 'Select language' })}
        </Select.Option>,
      );
    }

    LANGUAGES.forEach(lang => {
      languageOptions.push(
        <Select.Option key={lang.id} value={lang.id}>
          {getLanguageText(lang)}
        </Select.Option>,
      );
    });

    return (
      <React.Fragment>
        {!chosenType && (
          <div className="CreateObject__row align-right">
            <span role="presentation" className="CreateObject__button" onClick={this.toggleModal}>
              {this.props.intl.formatMessage({
                id: 'create_new_object',
                defaultMessage: 'create new object',
              })}
            </span>
          </div>
        )}

        {this.state.isModalOpen && (
          <Modal
            title={this.props.intl.formatMessage({
              id: 'create_new_object',
              defaultMessage: 'Create new object',
            })}
            closable
            onCancel={this.toggleModal}
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
                initialValue: this.props.currentLocaleInList.id,
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
                initialValue: chosenType,
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
                  disabled={Boolean(this.props.chosenType)}
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
