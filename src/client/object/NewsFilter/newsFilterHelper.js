import { Col, Icon, Row } from 'antd';
import _ from 'lodash';
import React from 'react';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCard from '../../components/Sidebar/ObjectCard';

const andLayout = (compareItems, self, isMobile) =>
  compareItems > 0 && !isMobile ? (
    <Col className="NewsFiltersRule-line-and" span={2}>
      {self.props.intl.formatMessage({
        id: 'and',
        defaultMessage: 'and',
      })}
    </Col>
  ) : null;

const getAllowListLayout = self => {
  const allowList = self.state.allowList;
  const isMobile = self.props.screenSize === 'xsmall';
  const currObjId = self.props.wObject.author_permlink;
  return (
    <React.Fragment>
      {_.map(allowList, (items, rowIndex) => {
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
              {_.map(items, (item, index) => {
                ruleIndex = index + 1;
                itemsIdsToOmit.push(item.id);
                return (
                  <React.Fragment key={`allowList${ruleIndex}${item.id}`}>
                    {andLayout(index, self, isMobile)}
                    <Col className="NewsFiltersRule-line-card" span={isMobile ? 24 : 6}>
                      <ObjectCard
                        wobject={{ ...item, author_permlink: item.id }}
                        showFollow={false}
                        isNewWindow
                      />
                      <div className="NewsFiltersRule-line-close">
                        <Icon
                          type="close-circle"
                          onClick={() => self.deleteRuleItem(rowIndex, item.id)}
                        />
                      </div>
                    </Col>
                  </React.Fragment>
                );
              })}
              {items.length < 5 && (
                <React.Fragment>
                  {andLayout(items.length, self, isMobile)}
                  <Col className="NewsFiltersRule-line-search" span={isMobile ? 24 : 6}>
                    <SearchObjectsAutocomplete
                      allowClear={false}
                      itemsIdsToOmit={itemsIdsToOmit}
                      rowIndex={rowIndex}
                      ruleIndex={ruleIndex}
                      style={{ width: '100%' }}
                      placeholder="Please select"
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
  const isMobile = self.props.screenSize === 'xsmall';

  const layout = (
    <Row className="NewsFiltersRule-line">
      {_.map(ignoreList, (item, index) => {
        itemsIdsToOmit.push(item.id);
        return (
          <React.Fragment key={`ignoreList${item.id}`}>
            {andLayout(index, self, isMobile)}
            <Col className="NewsFiltersRule-line-card" span={isMobile ? 24 : 6}>
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
          {andLayout(ignoreList.length, self, isMobile)}
          <Col className="NewsFiltersRule-line-search" span={isMobile ? 24 : 6}>
            <SearchObjectsAutocomplete
              allowClear={false}
              itemsIdsToOmit={itemsIdsToOmit}
              style={{ width: '100%' }}
              placeholder="Please select"
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
