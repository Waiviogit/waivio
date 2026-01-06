/**
 * Compatibility layer for antd v3 Form.create API in antd v5
 * 
 * This provides a Form.create() HOC that wraps components and provides
 * the old form prop API (getFieldDecorator, validateFields, etc.)
 */
import React from 'react';
import { Form as AntdForm } from 'antd';

// Create a HOC that mimics Form.create behavior
function createFormWrapper(options = {}) {
  return function wrapWithForm(WrappedComponent) {
    const FormWrapper = React.forwardRef((props, ref) => {
      const [form] = AntdForm.useForm();
      
      // Create legacy form API
      const legacyForm = {
        // Core methods
        getFieldDecorator: (name, fieldOptions = {}) => (element) => {
          const { rules, initialValue, valuePropName = 'value', trigger = 'onChange' } = fieldOptions;
          
          return (
            <AntdForm.Item
              name={name}
              rules={rules}
              initialValue={initialValue}
              valuePropName={valuePropName}
              trigger={trigger}
              noStyle
            >
              {element}
            </AntdForm.Item>
          );
        },
        
        // Validation
        validateFields: (fieldsOrCallback, callback) => {
          // Handle old API: validateFields(callback) or validateFields(fields, callback)
          const actualCallback = typeof fieldsOrCallback === 'function' ? fieldsOrCallback : callback;
          const fields = typeof fieldsOrCallback === 'function' ? undefined : fieldsOrCallback;
          
          if (actualCallback) {
            // Old callback API
            form.validateFields(fields)
              .then(values => actualCallback(null, values))
              .catch(({ errorFields, values }) => {
                const errors = errorFields?.reduce((acc, { name, errors }) => {
                  acc[name[0]] = { errors };
                  return acc;
                }, {});
                actualCallback(errors, values);
              });
          } else {
            // Promise API
            return form.validateFields(fields);
          }
        },
        
        validateFieldsAndScroll: (fieldsOrCallback, callback) => {
          const actualCallback = typeof fieldsOrCallback === 'function' ? fieldsOrCallback : callback;
          const fields = typeof fieldsOrCallback === 'function' ? undefined : fieldsOrCallback;
          
          if (actualCallback) {
            form.validateFields(fields)
              .then(values => {
                actualCallback(null, values);
              })
              .catch(({ errorFields, values }) => {
                if (errorFields?.length > 0) {
                  form.scrollToField(errorFields[0].name);
                }
                const errors = errorFields?.reduce((acc, { name, errors }) => {
                  acc[name[0]] = { errors };
                  return acc;
                }, {});
                actualCallback(errors, values);
              });
          } else {
            return form.validateFields(fields).catch(({ errorFields }) => {
              if (errorFields?.length > 0) {
                form.scrollToField(errorFields[0].name);
              }
              throw errorFields;
            });
          }
        },
        
        // Field value methods
        getFieldValue: (name) => form.getFieldValue(name),
        getFieldsValue: (names) => form.getFieldsValue(names),
        setFieldsValue: (values) => form.setFieldsValue(values),
        setFields: (fields) => {
          // Convert old format to new format
          const newFields = fields.map(field => ({
            name: field.name,
            value: field.value,
            errors: field.errors,
          }));
          form.setFields(newFields);
        },
        resetFields: (names) => form.resetFields(names),
        
        // Error methods
        getFieldError: (name) => form.getFieldError(name),
        getFieldsError: (names) => {
          const errors = form.getFieldsError(names);
          // Convert to old format { field: ['error'] }
          return errors.reduce((acc, { name: fieldName, errors: fieldErrors }) => {
            if (fieldErrors?.length) {
              acc[fieldName[0]] = fieldErrors;
            }
            return acc;
          }, {});
        },
        isFieldTouched: (name) => form.isFieldTouched(name),
        isFieldsTouched: (names, allTouched) => form.isFieldsTouched(names, allTouched),
        isFieldValidating: (name) => form.isFieldValidating(name),
        
        // Additional methods
        getFieldInstance: (name) => form.getFieldInstance(name),
        scrollToField: (name, options) => form.scrollToField(name, options),
        submit: () => form.submit(),
      };
      
      return (
        <AntdForm form={form} component={false}>
          <WrappedComponent {...props} form={legacyForm} ref={ref} />
        </AntdForm>
      );
    });
    
    FormWrapper.displayName = `Form(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    
    return FormWrapper;
  };
}

// Export Form with create method for compatibility
const Form = AntdForm;
Form.create = createFormWrapper;

export default Form;
export { Form, createFormWrapper };


