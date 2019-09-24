import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
// import './EditorObject.less';
import Action from '../Button/Action';

@injectIntl
@Form.create()
class FormattedLink extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    addLink: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const values = form.getFieldsValue();
    this.props.addLink('link', { title: values.linkTitle, url: values.url });
    form.resetFields();
  };

  render() {
    const { intl, form } = this.props;
    return (
      <React.Fragment>
        <Form className="Link" layout="vertical">
          <Form.Item>
            {form.getFieldDecorator('linkTitle', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'title_error_empty',
                    defaultMessage: 'title_error_empty',
                  }),
                },
                {
                  max: 255,
                  message: intl.formatMessage({
                    id: 'title_error_too_long',
                    defaultMessage: "Title can't be longer than 255 characters.",
                  }),
                },
              ],
            })(
              <Input
                ref={title => {
                  this.title = title;
                }}
                onChange={this.onUpdate}
                className="Editor__title"
                placeholder={intl.formatMessage({
                  id: 'title_placeholder',
                  defaultMessage: 'Add title',
                })}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {form.getFieldDecorator('url', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'link_error_empty',
                    defaultMessage: 'Please enter a url.',
                  }),
                },
                {
                  max: 255,
                  message: intl.formatMessage({
                    id: 'title_error_too_long',
                    defaultMessage: "Title can't be longer than 255 characters.",
                  }),
                },
              ],
            })(
              <Input
                ref={link => {
                  this.link = link;
                }}
                onChange={this.onUpdate}
                className="Editor__title"
                placeholder={intl.formatMessage({
                  id: 'link_placeholder',
                  defaultMessage: 'Add url',
                })}
              />,
            )}
          </Form.Item>
          <Form.Item className="Editor__bottom__submit">
            <Action primary big loading={false} onClick={this.handleSubmit}>
              <FormattedMessage id={'append_send'} defaultMessage={'Submit'} />
            </Action>
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  }
}

export default FormattedLink;
