import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Form, Input, Select, Button, Modal } from 'antd';
import './CreateObject.less';
import LANGUAGES from '../../translations/languages';
import { getLanguageText } from '../../translations';
import { objectFields } from '../../../common/constants/listOfFields';
import LikeSection from '../../object/LikeSection';
import FollowObjectForm from '../../object/FollowObjectForm';

@injectIntl
@Form.create()
class CreateObject extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    onCreateObject: PropTypes.func.isRequired,
    currentLocaleInList: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    currentLocaleInList: { id: 'en-US', name: '', nativeName: '' },
    wobject: { tag: '' },
    onCreateObject: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      loading: false,
    };
  }

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen, loading: false });
  };

  handleVotePercentChange = votePercent => this.setState({ votePercent });

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err && !this.state.loading) {
        this.setState({ loading: true });
        const objData = {
          ...values,
          id: values.name,
          type: values.type.toLowerCase(),
          isExtendingOpen: true,
          isPostingOpen: true,
          votePower: this.state.votePercent * 100,
        };
        this.props.onCreateObject(objData);
        _.delay(this.toggleModal, 4500);
      }
    });
  };

  render() {
    const languageOptions = [];
    const { getFieldDecorator } = this.props.form;
    const { currentLocaleInList, intl, form } = this.props;
    const { loading } = this.state;

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
        <div className="CreateObject__row align-right">
          <span role="presentation" className="CreateObject__button" onClick={this.toggleModal}>
            {this.props.intl.formatMessage({
              id: 'create_new_object',
              defaultMessage: 'create new object',
            })}
          </span>
        </div>

        {this.state.isModalOpen && (
          <Modal
            title={this.props.intl.formatMessage({
              id: 'create_new_object',
              defaultMessage: 'Create new object',
            })}
            visible
            confirmLoading={this.state.isCreating}
            footer={null}
            onCancel={this.toggleModal}
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
                <Input
                  disabled={loading}
                  className="Editor__title"
                  placeholder={intl.formatMessage({
                    id: 'placeholder_obj_type',
                    defaultMessage: 'Object type',
                  })}
                />,
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
