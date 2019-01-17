import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Form, Input, Select, Button } from 'antd';
import './CreateObject.less';
import LANGUAGES from '../../translations/languages';
import { getLanguageText } from '../../translations';
import objectNameValidationRegExp from '../../../common/constants/validation';

@injectIntl
@Form.create()
class CreateObject extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    handleCreateObject: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    currentLocaleInList: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    currentLocaleInList: { id: 'en-US', name: '', nativeName: '' },
    wobject: { tag: '' },
    handleCreateObject: () => {},
    toggleModal: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  handleChangeLocale = () => {
    const { form } = this.props;
    const currValue = form.getFieldValue('value');
    form.setFieldsValue({ value: currValue });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err && !this.state.loading) {
        this.setState({ loading: true });
        const objData = values;
        objData.id = Math.random()
          .toString(32)
          .substring(2);
        objData.isExtendingOpen = true;
        objData.isPostingOpen = true;
        // console.log('Received values of form: ', values);
        this.props.handleCreateObject(objData);
        _.delay(this.props.toggleModal, 2000);
      }
    });
  };

  render() {
    const languageOptions = [];
    const { getFieldDecorator } = this.props.form;
    const { currentLocaleInList, intl } = this.props;

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
        <Form.Item>
          {getFieldDecorator('name', {
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
              {
                pattern: objectNameValidationRegExp,
                message: intl.formatMessage({
                  id: 'validation_special_symbols',
                  defaultMessage: 'Please dont use special simbols like "/", "?", "%", "&"',
                }),
              },
            ],
          })(
            <Input
              ref={value => {
                this.value = value;
              }}
              onChange={this.onUpdate}
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
            <Select style={{ width: '100%' }} onChange={this.handleChangeLocale}>
              {languageOptions}
            </Select>,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('type', {
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
              style={{ width: '100%' }}
              placeholder={intl.formatMessage({
                id: 'placeholder_obj_type',
                defaultMessage: 'Select a option and change input text above',
              })}
              onChange={this.handleSelectChange}
            >
              <Select.Option value="item">item</Select.Option>
              <Select.Option value="catalogue">catalogue</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <div>
          {intl.formatMessage({ id: 'create_new_object_message1', defaultMessage: 'Attention!' })}
        </div>
        <div>
          {intl.formatMessage({
            id: 'create_new_object_message2',
            defaultMessage: 'This object will be created in post form by WaivioBot.',
          })}
        </div>
        <div>
          {intl.formatMessage({
            id: 'create_new_object_message3',
            defaultMessage:
              'You do not spend additional resource credits and you will get a 70% of authors rewards.',
          })}
        </div>
        <Form.Item className="Editor__bottom__submit">
          <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}>
            {intl.formatMessage({ id: 'confirm', defaultMessage: 'Confirm' })}
          </Button>
        </Form.Item>
      </React.Fragment>
    );
  }
}

export default CreateObject;
