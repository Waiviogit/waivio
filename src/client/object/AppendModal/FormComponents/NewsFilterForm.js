import React, { useEffect, useRef, useState } from 'react';
import { AutoComplete, Icon, Input } from 'antd';
import { map, get } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCard from '../../../components/Sidebar/ObjectCard';
import listOfObjectTypes from '../../../../common/constants/listOfObjectTypes';

import './NewsFilterForm.less';

const NewsFilterForm = props => {
  const [searchString, setSearchString] = useState('');
  const isMobile = screenSize => screenSize === 'xsmall' || screenSize === 'small';
  const typesList = listOfObjectTypes.filter(type => !props.typeList.includes(type));
  const handleSelect = value => {
    props.handleAddTypeToIgnoreTypeList(value);
    setSearchString('');
  };
  const titleInputEl = useRef(null);

  useEffect(() => {
    titleInputEl.current.focus();
  }, [titleInputEl.current]);

  const andLayout = compareItems =>
    compareItems > 0 &&
    !isMobile(props.screenSize) && (
      <div className={`NewsFiltersRule__line-and`}>
        {props.intl.formatMessage({
          id: 'and',
          defaultMessage: 'and',
        })}
      </div>
    );

  const getAllowListLayout = () => (
    <React.Fragment>
      {map(props.allowList, (items, rowIndex) => {
        let ruleIndex = 0;
        const itemsIdsToOmit = [props.currObjId];

        return (
          <React.Fragment key={`allowWrap${rowIndex}`}>
            <div className="NewsFiltersRule-title AppendForm__appendTitles">{`${props.intl.formatMessage(
              {
                id: 'filterRule',
                defaultMessage: 'Filter rule',
              },
            )} ${rowIndex + 1}`}</div>
            <div className="NewsFiltersRule__line">
              <div className="NewsFiltersRule__card-wrap">
                {map(items, (item, index) => {
                  ruleIndex = index + 1;
                  itemsIdsToOmit.push(item.author_permlink);

                  return (
                    <React.Fragment key={`allowList${ruleIndex}${item.author_permlink}`}>
                      {andLayout(index)}
                      <div className="NewsFiltersRule__line-card">
                        <ObjectCard
                          wobject={{ ...item, author_permlink: item.author_permlink }}
                          showFollow={false}
                          isNewWindow
                        />
                        <div className="NewsFiltersRule__line-close">
                          <Icon
                            type="close-circle"
                            onClick={() => props.deleteRuleItem(rowIndex, item.author_permlink)}
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
              {items.length < 5 && (
                <div className="NewsFiltersRule__line-search">
                  <SearchObjectsAutocomplete
                    allowClear={false}
                    itemsIdsToOmit={itemsIdsToOmit}
                    rowIndex={rowIndex}
                    ruleIndex={ruleIndex}
                    placeholder={props.intl.formatMessage({
                      id: 'object_fiels_news_select_placeholder',
                      defaultMessage: 'Please select',
                    })}
                    handleSelect={props.handleAddObjectToRule}
                  />
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
      {props.allowList[0] && props.allowList[0].length > 0 && (
        <div role="presentation" className="NewLineButton" onClick={props.addNewNewsFilterLine}>
          <Icon type="plus-circle" />
          {props.intl.formatMessage({
            id: 'addNewRule',
            defaultMessage: 'Add new rule',
          })}
        </div>
      )}
    </React.Fragment>
  );

  const getIgnoreListLayout = () => {
    const itemsIdsToOmit = [props.currObjId];

    const layout = (
      <div className="NewsFiltersRule__line">
        <div className="NewsFiltersRule__card-wrap">
          {map(props.ignoreList, (item, index) => {
            itemsIdsToOmit.push(item.author_permlink);

            return (
              <React.Fragment key={`ignoreList${item.author_permlink}`}>
                {andLayout(index)}
                <div className="NewsFiltersRule__line-card">
                  <ObjectCard
                    wobject={{ ...item, author_permlink: item.author_permlink }}
                    showFollow={false}
                    isNewWindow
                  />
                  <div className="NewsFiltersRule__line-close">
                    <Icon
                      type="close-circle"
                      onClick={() => props.handleRemoveObjectFromIgnoreList(item)}
                    />
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        {props.ignoreList.length < 20 && (
          <React.Fragment>
            <div className="NewsFiltersRule__line-search">
              <SearchObjectsAutocomplete
                allowClear={false}
                itemsIdsToOmit={itemsIdsToOmit}
                placeholder={props.intl.formatMessage({
                  id: 'object_fiels_news_select_placeholder',
                  defaultMessage: 'Please select',
                })}
                handleSelect={props.handleAddObjectToIgnoreList}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    );

    return layout || null;
  };

  return (
    <React.Fragment>
      <Input
        ref={titleInputEl}
        disabled={props.loading}
        placeholder={props.intl.formatMessage({
          id: 'object_field_news_title',
          defaultMessage: 'News title',
        })}
        onChange={props.handleAddNewsFilterTitle}
      />
      {getAllowListLayout()}
      <div className="AppendForm__appendTitles">
        {props.intl.formatMessage({
          id: 'ignoreList',
          defaultMessage: 'Ignore list',
        })}
      </div>
      {getIgnoreListLayout()}
      <div className="AppendForm__appendTitles">
        {props.intl.formatMessage({
          id: 'list_types',
          defaultMessage: 'List types',
        })}
      </div>
      <div className="NewsFiltersRule__line">
        <div className="NewsFiltersRule__card-wrap">
          {map(props.typeList, (item, index) => (
            <React.Fragment key={`ignoreList${item}`}>
              {andLayout(index)}
              <div className="NewsFiltersRule__line-card NewsFiltersRule__line-card--types">
                <span>{item}</span>
                <div className="NewsFiltersRule__line-close">
                  <Icon
                    type="close-circle"
                    onClick={() => props.handleRemoveObjectFromIgnoreTypeList(item)}
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        {props.typeList.length < 20 && (
          <React.Fragment>
            <div className="NewsFiltersRule__line-search">
              <AutoComplete
                onSelect={handleSelect}
                value={searchString}
                onChange={value => setSearchString(value)}
                placeholder={props.intl.formatMessage({
                  id: 'object_fiels_news_select_placeholder',
                  defaultMessage: 'Please select',
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
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

NewsFilterForm.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  screenSize: PropTypes.string.isRequired,
  currObjId: PropTypes.string.isRequired,
  allowList: PropTypes.arrayOf().isRequired,
  ignoreList: PropTypes.arrayOf().isRequired,
  typeList: PropTypes.arrayOf().isRequired,
  loading: PropTypes.bool.isRequired,
  deleteRuleItem: PropTypes.func.isRequired,
  handleAddObjectToIgnoreList: PropTypes.func.isRequired,
  handleAddTypeToIgnoreTypeList: PropTypes.func.isRequired,
  handleRemoveObjectFromIgnoreTypeList: PropTypes.func.isRequired,
  handleAddNewsFilterTitle: PropTypes.func.isRequired,
  addNewNewsFilterLine: PropTypes.func.isRequired,
  handleAddObjectToRule: PropTypes.func.isRequired,
  handleRemoveObjectFromIgnoreList: PropTypes.func.isRequired,
};
export default injectIntl(NewsFilterForm);
