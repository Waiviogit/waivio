import { Col, Icon, Row } from 'antd';
import _ from 'lodash';
import React from 'react';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCard from '../../components/Sidebar/ObjectCard';

const getAllowListLayout = self => {
  const allowList = self.state.allowList;

  return (
    <React.Fragment>
      {_.map(allowList, (items, rowIndex) => {
        let ruleIndex = 0;
        const itemsIdsToOmit = [];
        return (
          <React.Fragment>
            <div className="NewsFiltersRule-title">{`Filter rule ${rowIndex + 1}`}</div>
            <Row className="NewsFiltersRule-line">
              {_.map(items, (item, index) => {
                ruleIndex = index + 1;
                itemsIdsToOmit.push(item.id);
                return (
                  <React.Fragment key={item.id}>
                    {index > 0 && (
                      <Col className="NewsFiltersRule-line-and" span={2}>
                        and
                      </Col>
                    )}
                    <Col className="NewsFiltersRule-line-card" span={6}>
                      <ObjectCard wobject={item} showFollow={false} />
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
                  {items.length > 0 && (
                    <Col className="NewsFiltersRule-line-and" span={2}>
                      and
                    </Col>
                  )}
                  <Col className="NewsFiltersRule-line-search" span={6}>
                    <SearchObjectsAutocomplete
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
      <div role="presentation" className="NewLineButton" onClick={self.addNewNewsFilterLine}>
        <Icon type="plus-circle" />
        Add new rule
      </div>
    </React.Fragment>
  );
};

export const getIgnoreListLayout = self => {
  const itemsIdsToOmit = [];
  const ignoreList = self.state.ignoreList;

  const layout = (
    <Row className="NewsFiltersRule-line">
      {_.map(ignoreList, (item, index) => {
        itemsIdsToOmit.push(item.id);
        return (
          <React.Fragment key={item.id}>
            {index > 0 && (
              <Col className="NewsFiltersRule-line-and" span={2}>
                and
              </Col>
            )}
            <Col className="NewsFiltersRule-line-card" span={6}>
              <ObjectCard wobject={item} showFollow={false} />
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
          {ignoreList.length > 0 && (
            <Col className="NewsFiltersRule-line-and" span={2}>
              and
            </Col>
          )}
          <Col className="NewsFiltersRule-line-search" span={6}>
            <SearchObjectsAutocomplete
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
    <div className="AppendForm__appendTitles">Ignore list</div>
    {getIgnoreListLayout(self)}
  </React.Fragment>
);
