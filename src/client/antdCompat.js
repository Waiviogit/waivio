/**
 * antd v5 compatibility polyfill
 * 
 * This patches antd Form to add back Form.create() for compatibility with v3 code.
 * Import this file BEFORE any components that use Form.create()
 */
const antd = require('antd');
const React = require('react');

function createFormWrapper(options = {}) {
  return function wrapWithForm(WrappedComponent) {
    const FormWrapper = React.forwardRef((props, ref) => {
      const [form] = antd.Form.useForm();
      
      // Create legacy form API
      const legacyForm = {
        getFieldDecorator: (name, fieldOptions = {}) => (element) => {
          const { rules, initialValue, valuePropName = 'value', trigger = 'onChange', getValueFromEvent } = fieldOptions;
          
          return React.createElement(antd.Form.Item, {
            name,
            rules,
            initialValue,
            valuePropName,
            trigger,
            getValueFromEvent,
            noStyle: true,
          }, element);
        },
        
        validateFields: (fieldsOrCallback, callback) => {
          const actualCallback = typeof fieldsOrCallback === 'function' ? fieldsOrCallback : callback;
          const fields = typeof fieldsOrCallback === 'function' ? undefined : fieldsOrCallback;
          
          if (actualCallback) {
            form.validateFields(fields)
              .then(values => actualCallback(null, values))
              .catch(({ errorFields, values }) => {
                const errors = errorFields?.reduce((acc, { name: n, errors: errs }) => {
                  acc[n[0]] = { errors: errs };
                  return acc;
                }, {});
                actualCallback(errors, values);
              });
          } else {
            return form.validateFields(fields);
          }
        },
        
        validateFieldsAndScroll: (fieldsOrCallback, callback) => {
          const actualCallback = typeof fieldsOrCallback === 'function' ? fieldsOrCallback : callback;
          const fields = typeof fieldsOrCallback === 'function' ? undefined : fieldsOrCallback;
          
          if (actualCallback) {
            form.validateFields(fields)
              .then(values => actualCallback(null, values))
              .catch(({ errorFields, values }) => {
                if (errorFields?.length > 0) {
                  form.scrollToField(errorFields[0].name);
                }
                const errors = errorFields?.reduce((acc, { name: n, errors: errs }) => {
                  acc[n[0]] = { errors: errs };
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
        
        getFieldValue: (name) => form.getFieldValue(name),
        getFieldsValue: (names) => form.getFieldsValue(names),
        setFieldsValue: (values) => form.setFieldsValue(values),
        setFields: (fields) => {
          const newFields = fields.map(field => ({
            name: field.name,
            value: field.value,
            errors: field.errors,
          }));
          form.setFields(newFields);
        },
        resetFields: (names) => form.resetFields(names),
        
        getFieldError: (name) => form.getFieldError(name),
        getFieldsError: (names) => {
          const errors = form.getFieldsError(names);
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
        
        getFieldInstance: (name) => form.getFieldInstance(name),
        scrollToField: (name, scrollOptions) => form.scrollToField(name, scrollOptions),
        submit: () => form.submit(),
      };
      
      return React.createElement(antd.Form, { form, component: false },
        React.createElement(WrappedComponent, { ...props, form: legacyForm, ref })
      );
    });
    
    FormWrapper.displayName = `Form(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    
    return FormWrapper;
  };
}

// Patch Form.create
if (!antd.Form.create) {
  antd.Form.create = createFormWrapper;
  console.log('[antd-compat] Form.create polyfill installed');
}

module.exports = antd.Form;
module.exports.default = antd.Form;

