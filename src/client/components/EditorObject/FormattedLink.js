import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Form, Input, Modal } from 'antd';

import '../Editor/Editor.less';

@injectIntl
@Form.create()
class FormattedLink extends React.Component {
  static propTypes = {
    intl: PropTypes.shape(),
    form: PropTypes.shape(),
    addLink: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    isOpenModal: PropTypes.bool,
  };

  static defaultProps = {
    intl: {},
    form: {},
    isOpenModal: false,
    handleCloseModal: () => {},
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, handleCloseModal } = this.props;
    const values = form.getFieldsValue();
    this.props.addLink('object', { title: values.linkTitle, url: values.url });
    form.resetFields();
    handleCloseModal();
  };

  render() {
    const { intl, form, isOpenModal, handleCloseModal } = this.props;

    return (
        <Modal
          className="Editor__modal"
          onCancel={handleCloseModal}
          visible={isOpenModal}
          title="Add link"
          onOk={this.handleSubmit}
        >
          <Form className="Link" layout="vertical">
            <Form.Item>
              {form.getFieldDecorator('linkTitle', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'title_error_empty',
                      defaultMessage: 'Please enter a title',
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
                      defaultMessage: 'Please enter the URL',
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
          </Form>
        </Modal>
    );
  }
}

export default FormattedLink;
