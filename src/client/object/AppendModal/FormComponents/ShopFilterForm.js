import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, map, get } from 'lodash';
import { AutoComplete, Icon } from 'antd';
import PropTypes from 'prop-types';
import listOfObjectTypes from '../../../../common/constants/listOfObjectTypes';
import SearchDepartmentAutocomplete from '../../../components/SearchDepartmentAutocomplete/SearchDepartmentAutocomplete';
import { andLayout, orLayout } from '../../../../common/helpers/AppendFormHelper';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';

const ShopFilterForm = ({
  intl,
  handleAddTypeToShopTypeList,
  typeList,
  handleRemoveTypeFromShopTypeList,
  handleSelectTag,
  tags,
  handleRemoveTag,
  authoritiesList,
  deleteUserFromAuthorityList,
  addUserToAuthorityList,
  departmentsArray,
  handleChangeDepartmentValue,
  onAddDepartmentSection,
  newRuleBlockArray,
}) => {
  const [searchString, setSearchString] = useState('');
  const typesList = listOfObjectTypes.filter(type => type !== 'shop');

  const handleSelect = value => {
    handleAddTypeToShopTypeList(value);

    setSearchString('');
  };

  return (
    <div>
      <div className="NewsFiltersRule-title AppendForm__appendTitles">
        <FormattedMessage id="placeholder_obj_type" defaultMessage="Object type" />
      </div>
      <div className="NewsFiltersRule__line">
        <div className="NewsFiltersRule__card-wrap">
          {map(typeList, item => (
            <React.Fragment key={`typeList${item}`}>
              <div className="NewsFiltersRule__line-card NewsFiltersRule__line-card--types">
                <span>{item}</span>
                <div className="NewsFiltersRule__line-close">
                  <Icon type="close-circle" onClick={handleRemoveTypeFromShopTypeList} />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <React.Fragment>
          {isEmpty(typeList) && (
            <div className="NewsFiltersRule__line-search">
              <AutoComplete
                onSelect={handleSelect}
                value={searchString}
                onChange={value => setSearchString(value)}
                placeholder={intl.formatMessage({
                  id: 'object_fiels_news_select_placeholder',
                  defaultMessage: 'Please select',
                })}
                optionFilterProp="children"
                filterOption={(inputValue, option) =>
                  get(option, 'key', '')
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              >
                {typesList.map(type => (
                  <AutoComplete.Option key={type} value={type}>
                    {type}
                  </AutoComplete.Option>
                ))}
              </AutoComplete>
            </div>
          )}
        </React.Fragment>
      </div>
      <div className="NewsFiltersRule-title AppendForm__appendTitles">
        <FormattedMessage id="departments" defaultMessage="Departments" />
      </div>
      {newRuleBlockArray.map((rule, index) => (
        // eslint-disable-next-line react/jsx-key
        <div className="NewsFiltersRule__line">
          {index > 0 && (
            <div className="AppendForm__or">
              <FormattedMessage id="or" defaultMessage="or" />
            </div>
          )}
          <div className="NewsFiltersRule__card-wrap">
            {map(departmentsArray[index], (item, i) => (
              <React.Fragment key={`departmentsList${item}`}>
                {andLayout(i)}
                <div className="NewsFiltersRule__line-card NewsFiltersRule__line-card--types">
                  <span>{item}</span>
                  <div className="NewsFiltersRule__line-close">
                    <Icon
                      type="close-circle"
                      onClick={() => handleChangeDepartmentValue(item, index)}
                    />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <React.Fragment>
            <div className="NewsFiltersRule__line-search">
              <SearchDepartmentAutocomplete
                placeholder={intl.formatMessage({
                  id: 'object_fiels_news_select_placeholder',
                  defaultMessage: 'Please select',
                })}
                normalSize
                isMultiple
                handleSelectValue={val => handleChangeDepartmentValue(val, index)}
              />
            </div>
          </React.Fragment>
        </div>
      ))}
      <div className="icon-button" role="presentation" onClick={onAddDepartmentSection}>
        <div className="icon-button__icon">
          <Icon type="plus-circle" />
        </div>
        <div className="icon-button__text">
          <FormattedMessage id="add_new_rule" defaultMessage="Add new rule" />
        </div>
      </div>
      <div className="NewsFiltersRule-title AppendForm__appendTitles">
        <FormattedMessage id="tags" defaultMessage="Tags" />
      </div>
      <div className="NewsFiltersRule__card-wrap">
        {map(tags, (item, index) => (
          <React.Fragment key={`tag${item}`}>
            {orLayout(index)}
            <div className="NewsFiltersRule__line-card NewsFiltersRule__line-card--types">
              <span>{item}</span>
              <div className="NewsFiltersRule__line-close">
                <Icon type="close-circle" onClick={() => handleRemoveTag(item)} />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <React.Fragment>
        <div className="NewsFiltersRule__line-search">
          <SearchObjectsAutocomplete
            autoFocus={false}
            handleSelect={handleSelectTag}
            objectType="hashtag"
          />
        </div>
      </React.Fragment>
      <div className="NewsFiltersRule-title AppendForm__appendTitles">
        <FormattedMessage id="authorities" defaultMessage="Authorities" />
      </div>
      <div className="NewsFiltersRule__line">
        <div className="NewsFiltersRule__card-wrap">
          {authoritiesList.map((user, index) => (
            <React.Fragment key={`authority${user.account}`}>
              {orLayout(index)}
              <div>
                <SelectUserForAutocomplete
                  isNewsFeed
                  account={user.account}
                  resetUser={() => deleteUserFromAuthorityList(user)}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="NewsFiltersRule__line-search">
          <SearchUsersAutocomplete autoFocus={false} handleSelect={addUserToAuthorityList} />
        </div>
      </div>
    </div>
  );
};

ShopFilterForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  handleAddTypeToShopTypeList: PropTypes.func.isRequired,
  handleRemoveTypeFromShopTypeList: PropTypes.func.isRequired,
  addUserToAuthorityList: PropTypes.func.isRequired,
  deleteUserFromAuthorityList: PropTypes.func.isRequired,
  handleSelectTag: PropTypes.func.isRequired,
  handleRemoveTag: PropTypes.func.isRequired,
  handleChangeDepartmentValue: PropTypes.func.isRequired,
  onAddDepartmentSection: PropTypes.func.isRequired,
  typeList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  newRuleBlockArray: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  departmentsArray: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  authoritiesList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
export default injectIntl(ShopFilterForm);
