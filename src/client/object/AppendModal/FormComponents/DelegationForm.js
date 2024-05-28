import React from 'react';
import { Form } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import { blogFields, objectFields } from '../../../../common/constants/listOfFields';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';

const DelegationForm = ({
  getFieldDecorator,
  getFieldRules,
  selectedUserBlog,
  handleResetUserBlog,
  handleSelectUserBlog,
  intl,
}) => (
  <>
    <div className={classNames('AppendForm__appendTitles')} style={{ marginBottom: '2px' }}>
      <FormattedMessage id="user" defaultMessage="User" />
    </div>
    <div>
      <Form.Item>
        {getFieldDecorator(blogFields.account, {
          rules: getFieldRules(objectFields.blog),
        })(
          <>
            {isEmpty(selectedUserBlog) && (
              <SearchUsersAutocomplete
                handleSelect={handleSelectUserBlog}
                placeholder={intl.formatMessage({
                  id: 'find_a_user',
                  defaultMessage: 'Find a user',
                })}
              />
            )}
          </>,
        )}
        {!isEmpty(selectedUserBlog) && (
          <SelectUserForAutocomplete account={selectedUserBlog} resetUser={handleResetUserBlog} />
        )}
      </Form.Item>
      <p>
        Assign a user to delegate exclusive administrative rights limited to the site(s) where you
        hold ownership or administrator status.
      </p>
    </div>
  </>
);

DelegationForm.propTypes = {
  handleSelectUserBlog: PropTypes.func,
  handleResetUserBlog: PropTypes.func,
  getFieldRules: PropTypes.func,
  getFieldDecorator: PropTypes.func,
  selectedUserBlog: PropTypes.shape(),
  intl: PropTypes.shape(),
};

export default injectIntl(DelegationForm);
