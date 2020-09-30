import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { socialObjectFields } from '../../../../../common/constants/listOfFields';

const ItemSocialLinks = (
  getFieldDecorator,
  isSomeValue,
  loading,
  intl,
  combinedFieldValidationMsg,
) => (
  <React.Fragment>
    {socialObjectFields.map(profile => (
      <Form.Item key={profile.id}>
        {getFieldDecorator(`link${profile.name}`, {
          rules: [
            {
              message: intl.formatMessage({
                id: 'profile_social_profile_incorrect',
                defaultMessage:
                  "This doesn't seem to be valid username. Only alphanumeric characters, hyphens, underscores and dots are allowed.",
              }),
              pattern: /^[0-9A-Za-z-_.]+$/,
            },
          ],
        })(
          <Input
            className={classNames('AppendForm__input', {
              'validation-error': !isSomeValue,
            })}
            size="large"
            prefix={
              <i
                className={`Settings__prefix-icon iconfont icon-${profile.icon}`}
                style={{
                  color: profile.color,
                }}
              />
            }
            disabled={loading}
            placeholder={profile.name}
          />,
        )}
      </Form.Item>
    ))}
    {combinedFieldValidationMsg}
  </React.Fragment>
);
export default ItemSocialLinks;
