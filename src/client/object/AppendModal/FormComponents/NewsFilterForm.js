import { AutoComplete, Col, Icon, Input, Row } from 'antd';
import { map, get } from 'lodash';
import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCard from '../../../components/Sidebar/ObjectCard';
import listOfObjectTypes from '../../../../common/constants/listOfObjectTypes';

const NewsFilterForm = props => {
  const [searchString, setSearchString] = useState('');
  const isMobile = screenSize => screenSize === 'xsmall' || screenSize === 'small';

  const andLayout = (compareItems, isTypes) =>
    compareItems > 0 && !isMobile(props.screenSize) ? (
      <Col
        className={`NewsFiltersRule-line-and ${isTypes ? 'NewsFiltersRule-line-and--little' : ''}`}
        span={2}
      >
        {props.intl.formatMessage({
          id: 'and',
          defaultMessage: 'and',
        })}
      </Col>
    ) : null;

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
            <Row className="NewsFiltersRule-line">
              {map(items, (item, index) => {
                ruleIndex = index + 1;
                itemsIdsToOmit.push(item.author_permlink);

                return (
                  <React.Fragment key={`allowList${ruleIndex}${item.author_permlink}`}>
                    {andLayout(index)}
                    <Col
                      className="NewsFiltersRule-line-card"
                      span={isMobile(props.screenSize) ? 24 : 6}
                    >
                      <ObjectCard
                        wobject={{ ...item, author_permlink: item.author_permlink }}
                        showFollow={false}
                        isNewWindow
                      />
                      <div className="NewsFiltersRule-line-close">
                        <Icon
                          type="close-circle"
                          onClick={() => props.deleteRuleItem(rowIndex, item.author_permlink)}
                        />
                      </div>
                    </Col>
                  </React.Fragment>
                );
              })}
              {items.length < 5 && (
                <React.Fragment>
                  {andLayout(items.length)}
                  <Col
                    className="NewsFiltersRule-line-search"
                    span={isMobile(props.screenSize) ? 20 : 6}
                  >
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
                  </Col>
                </React.Fragment>
              )}
            </Row>
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
    const ignoreList = props.ignoreList;

    const layout = (
      <Row className="NewsFiltersRule-line">
        {map(ignoreList, (item, index) => {
          itemsIdsToOmit.push(item.author_permlink);

          return (
            <React.Fragment key={`ignoreList${item.author_permlink}`}>
              {andLayout(index)}
              <Col className="NewsFiltersRule-line-card" span={isMobile(props.screenSize) ? 24 : 6}>
                <ObjectCard
                  wobject={{ ...item, author_permlink: item.author_permlink }}
                  showFollow={false}
                  isNewWindow
                />
                <div className="NewsFiltersRule-line-close">
                  <Icon
                    type="close-circle"
                    onClick={() => props.handleRemoveObjectFromIgnoreList(item)}
                  />
                </div>
              </Col>
            </React.Fragment>
          );
        })}
        {ignoreList.length < 20 && (
          <React.Fragment>
            {andLayout(ignoreList.length)}
            <Col className="NewsFiltersRule-line-search" span={isMobile(props.screenSize) ? 20 : 6}>
              <SearchObjectsAutocomplete
                allowClear={false}
                itemsIdsToOmit={itemsIdsToOmit}
                placeholder={props.intl.formatMessage({
                  id: 'object_fiels_news_select_placeholder',
                  defaultMessage: 'Please select',
                })}
                handleSelect={props.handleAddObjectToIgnoreList}
              />
            </Col>
          </React.Fragment>
        )}
      </Row>
    );

    return layout || null;
  };

  const getIgnoreTypesListLayout = () => {
    const ignoreList = props.typeList;
    const typesList = listOfObjectTypes.filter(type => !ignoreList.includes(type));
    const handleSelect = value => {
      props.handleAddTypeToIgnoreTypeList(value);
      setSearchString('');
    };

    const layout = (
      <Row className="NewsFiltersRule-line">
        {map(ignoreList, (item, index) => (
          <React.Fragment key={`ignoreList${item}`}>
            {andLayout(index)}
            <Col className="NewsFiltersRule-line-card" span={isMobile(props.screenSize) ? 24 : 6}>
              <span>{item}</span>
              <div className="NewsFiltersRule-line-close">
                <Icon
                  type="close-circle"
                  onClick={() => props.handleRemoveObjectFromIgnoreTypeList(item)}
                />
              </div>
            </Col>
          </React.Fragment>
        ))}
        {ignoreList.length < 20 && (
          <React.Fragment>
            {andLayout(ignoreList.length, true)}
            <Col className="NewsFiltersRule-line-search" span={isMobile(props.screenSize) ? 20 : 6}>
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
            </Col>
          </React.Fragment>
        )}
      </Row>
    );

    return layout || null;
  };

  return (
    <React.Fragment>
      <Input
        disabled={props.loading}
        placeholder={props.intl.formatMessage({
          id: 'object_field_news_title',
          defaultMessage: 'News title',
        })}
        onChange={props.handleAddNewsFilterTitle}
      />
      {getAllowListLayout(props)}
      <div className="AppendForm__appendTitles">
        {props.intl.formatMessage({
          id: 'ignoreList',
          defaultMessage: 'Ignore list',
        })}
      </div>
      {getIgnoreListLayout(props)}
      <div className="AppendForm__appendTitles">
        {props.intl.formatMessage({
          id: 'list_types',
          defaultMessage: 'List types',
        })}
      </div>
      {getIgnoreTypesListLayout(props)}
    </React.Fragment>
  );
};

NewsFilterForm.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  screenSize: PropTypes.string.isRequired,
  // const currObjId = props.wObject.author_permlink;
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
