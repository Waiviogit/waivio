import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select } from 'antd';
import { map } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { formColumnsField, formFormFields } from '../../../common/constants/listOfFields';

const ObjectForm = props => {
  const {
    form,
    intl,
    loading,
    formForm,
    formColumn,
    getFieldRules,
    handleSelectColumn,
    handleSelectForm,
  } = props;

  return (
    <React.Fragment>
      <Form.Item>
        {form.getFieldDecorator('formTitle', {
          rules: getFieldRules('formTitle'),
        })(
          <Input
            className="AppendForm__input"
            disabled={loading}
            placeholder={intl.formatMessage({
              id: 'form_title',
              defaultMessage: 'Form title',
            })}
          />,
        )}
      </Form.Item>
      <div className="ant-form-item-label AppendForm__appendTitles">
        <FormattedMessage id="columns" defaultMessage="Columns" />
      </div>
      <Form.Item>
        {form.getFieldDecorator('formColumn', {
          initialValue: formColumn,
          rules: [
            {
              required: true,
              message: intl.formatMessage(
                {
                  id: 'field_error',
                  defaultMessage: 'Field is required',
                },
                { field: 'Column' },
              ),
            },
          ],
        })(
          <Select disabled={loading} onChange={handleSelectColumn}>
            {map(Object.keys(formColumnsField), column => (
              <Select.Option key={formColumnsField[column]} value={formColumnsField[column]}>
                {intl.formatMessage({
                  id: column,
                  defaultMessage: formColumnsField[column],
                })}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <div className="ant-form-item-label AppendForm__appendTitles">
        <FormattedMessage id="form" defaultMessage="Form" />
      </div>
      <Form.Item>
        {form.getFieldDecorator('formForm', {
          initialValue: formForm,
          rules: [
            {
              required: true,
              message: intl.formatMessage(
                {
                  id: 'field_error',
                  defaultMessage: 'Field is required',
                },
                { field: 'Form' },
              ),
            },
          ],
        })(
          <Select disabled={loading} onChange={handleSelectForm}>
            {map(formFormFields, formItem => (
              <Select.Option id={formItem} value={formItem}>
                {intl.formatMessage({
                  id: formItem,
                  defaultMessage: formItem,
                })}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      {formForm === formFormFields.link ? (
        <React.Fragment>
          <div className="ant-form-item-label AppendForm__appendTitles">
            <FormattedMessage id="Link" defaultMessage="Link" />
          </div>
          <Form.Item>
            {form.getFieldDecorator('formLink', {
              rules: getFieldRules('formLink'),
            })(
              <Input
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'Link',
                  defaultMessage: 'Link',
                })}
              />,
            )}
          </Form.Item>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="ant-form-item-label AppendForm__appendTitles">
            <FormattedMessage id="Widget" defaultMessage="Widget" />
          </div>
          <Form.Item>
            {form.getFieldDecorator('formWidget', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(
                    {
                      id: 'field_error',
                      defaultMessage: 'Field is required',
                    },
                    { field: 'Widget' },
                  ),
                },
              ],
            })(
              <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 100 }}
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'Widget',
                  defaultMessage: 'Paste code',
                })}
              />,
            )}
          </Form.Item>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

ObjectForm.propTypes = {
  form: PropTypes.shape(),
  intl: PropTypes.shape(),
  loading: PropTypes.bool,
  formForm: PropTypes.string.isRequired,
  formColumn: PropTypes.string.isRequired,
  handleSelectColumn: PropTypes.shape(),
  handleSelectForm: PropTypes.shape(),
  getFieldRules: PropTypes.shape(),
};

ObjectForm.defaultProps = {
  form: {},
  intl: {},
  loading: false,
  handleSelectColumn: () => {},
  handleSelectForm: () => {},
  getFieldRules: () => {},
};

export default ObjectForm;
