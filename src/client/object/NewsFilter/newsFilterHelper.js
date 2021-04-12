import { Col, Icon, Input, Row } from 'antd';
import { map } from 'lodash';
import React from 'react';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCard from '../../components/Sidebar/ObjectCard';

const isMobile = screenSize => screenSize === 'xsmall' || screenSize === 'small';

const andLayout = (compareItems, self) =>
  compareItems > 0 && !isMobile(self.props.screenSize) ? (
    <Col className="NewsFiltersRule-line-and" span={2}>
      {self.props.intl.formatMessage({
        id: 'and',
        defaultMessage: 'and',
      })}
    </Col>
  ) : null;

const getAllowListLayout = self => {
  const allowList = self.state.allowList;
  const currObjId = self.props.wObject.author_permlink;

  return (
    <React.Fragment>
      {map(allowList, (items, rowIndex) => {
        let ruleIndex = 0;
        const itemsIdsToOmit = [currObjId];

        return (
          <React.Fragment key={`allowWrap${rowIndex}`}>
            <div className="NewsFiltersRule-title AppendForm__appendTitles">{`${self.props.intl.formatMessage(
              {
                id: 'filterRule',
                defaultMessage: 'Filter rule',
              },
            )} ${rowIndex + 1}`}</div>
            <Row className="NewsFiltersRule-line">
              {map(items, (item, index) => {
                ruleIndex = index + 1;
                itemsIdsToOmit.push(item.id);

                return (
                  <React.Fragment key={`allowList${ruleIndex}${item.author_permlink}`}>
                    {andLayout(index, self)}
                    <Col
                      className="NewsFiltersRule-line-card"
                      span={isMobile(self.props.screenSize) ? 24 : 6}
                    >
                      <ObjectCard
                        wobject={{ ...item, author_permlink: item.author_permlink }}
                        showFollow={false}
                        isNewWindow
                      />
                      <div className="NewsFiltersRule-line-close">
                        <Icon
                          type="close-circle"
                          onClick={() => self.deleteRuleItem(rowIndex, item.author_permlink)}
                        />
                      </div>
                    </Col>
                  </React.Fragment>
                );
              })}
              {items.length < 5 && (
                <React.Fragment>
                  {andLayout(items.length, self)}
                  <Col
                    className="NewsFiltersRule-line-search"
                    span={isMobile(self.props.screenSize) ? 20 : 6}
                  >
                    <SearchObjectsAutocomplete
                      allowClear={false}
                      itemsIdsToOmit={itemsIdsToOmit}
                      rowIndex={rowIndex}
                      ruleIndex={ruleIndex}
                      placeholder={self.props.intl.formatMessage({
                        id: 'object_fiels_news_select_placeholder',
                        defaultMessage: 'Please select',
                      })}
                      handleSelect={self.handleAddObjectToRule}
                    />
                  </Col>
                </React.Fragment>
              )}
            </Row>
          </React.Fragment>
        );
      })}
      {allowList[0] && allowList[0].length > 0 && (
        <div role="presentation" className="NewLineButton" onClick={self.addNewNewsFilterLine}>
          <Icon type="plus-circle" />
          {self.props.intl.formatMessage({
            id: 'addNewRule',
            defaultMessage: 'Add new rule',
          })}
        </div>
      )}
    </React.Fragment>
  );
};

export const getIgnoreListLayout = self => {
  const itemsIdsToOmit = [self.props.wObject.author_permlink];
  const ignoreList = self.state.ignoreList;

  const layout = (
    <Row className="NewsFiltersRule-line">
      {map(ignoreList, (item, index) => {
        itemsIdsToOmit.push(item.id);

        return (
          <React.Fragment key={`ignoreList${item.id}`}>
            {andLayout(index, self)}
            <Col
              className="NewsFiltersRule-line-card"
              span={isMobile(self.props.screenSize) ? 24 : 6}
            >
              <ObjectCard
                wobject={{ ...item, author_permlink: item.id }}
                showFollow={false}
                isNewWindow
              />
              <div className="NewsFiltersRule-line-close">
                <Icon
                  type="close-circle"
                  onClick={() => self.handleRemoveObjectFromIgnoreList(item)}
                />
              </div>
            </Col>
          </React.Fragment>
        );
      })}
      {ignoreList.length < 20 && (
        <React.Fragment>
          {andLayout(ignoreList.length, self)}
          <Col
            className="NewsFiltersRule-line-search"
            span={isMobile(self.props.screenSize) ? 20 : 6}
          >
            <SearchObjectsAutocomplete
              allowClear={false}
              itemsIdsToOmit={itemsIdsToOmit}
              placeholder={self.props.intl.formatMessage({
                id: 'object_fiels_news_select_placeholder',
                defaultMessage: 'Please select',
              })}
              handleSelect={self.handleAddObjectToIgnoreList}
            />
          </Col>
        </React.Fragment>
      )}
    </Row>
  );

  return layout || null;
};

export const getNewsFilterLayout = self => (
  <React.Fragment>
    <Input
      disabled={self.loading}
      placeholder={self.props.intl.formatMessage({
        id: 'object_field_news_title',
        defaultMessage: 'News title',
      })}
      onChange={self.handleAddNewsFilterTitle}
    />
    {getAllowListLayout(self)}
    <div className="AppendForm__appendTitles">
      {self.props.intl.formatMessage({
        id: 'ignoreList',
        defaultMessage: 'Ignore list',
      })}
    </div>
    {getIgnoreListLayout(self)}
  </React.Fragment>
);
