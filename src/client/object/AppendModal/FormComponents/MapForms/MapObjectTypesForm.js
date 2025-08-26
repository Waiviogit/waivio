import React, { useState } from 'react';
import { AutoComplete, Icon } from 'antd';
import { get, map } from 'lodash';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import listOfObjectTypes from '../../../../../common/constants/listOfObjectTypes';
import { andLayout } from '../../../../../common/helpers/AppendFormHelper';

const MapObjectTypesForm = props => {
  const [searchString, setSearchString] = useState('');
  const typesList = listOfObjectTypes.filter(type => !props.typeList.includes(type));
  const handleSelect = value => {
    props.handleAddTypeTypeList(value);
    setSearchString('');
  };

  return (
    <div className={'MapForms'}>
      <div className="NewsFiltersRule__line">
        {props.typeList.length < 20 && (
          <React.Fragment>
            <div className="NewsFiltersRule__line-search">
              <div className={classNames('ant-form-item-label AppendForm__appendTitles')}>
                <FormattedMessage id="object_field_mapObjectTypes" defaultMessage="Object types" />
              </div>
              <div className="NewsFiltersRule__card-wrap mb2">
                {map(props.typeList, (item, index) => (
                  <React.Fragment key={`ignoreList${item}`}>
                    {andLayout(index)}
                    <div className="NewsFiltersRule__line-card NewsFiltersRule__line-card--types">
                      <span>{item}</span>
                      <div className="NewsFiltersRule__line-close">
                        <Icon
                          type="close-circle"
                          onClick={() => props.handleRemoveObjectFromTypeList(item)}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <AutoComplete
                onSelect={handleSelect}
                value={searchString}
                onChange={value => setSearchString(value)}
                placeholder={props.intl.formatMessage({
                  id: 'select_a_type',
                  defaultMessage: 'Select a type',
                })}
                optionFilterProp="children"
                filterOption={(inputValue, option) =>
                  get(option, 'props.value', '')
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
              <p>
                {props.intl.formatMessage({
                  id: 'object_type_note',
                  defaultMessage:
                    'Filter objects by type to display only selected ones on the map.',
                })}
              </p>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

MapObjectTypesForm.propTypes = {
  typeList: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.arrayOf(PropTypes.shape()),
  handleRemoveObjectFromTypeList: PropTypes.func,
  handleAddTypeTypeList: PropTypes.func,
};

export default injectIntl(MapObjectTypesForm);
