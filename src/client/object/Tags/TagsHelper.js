import { Icon, Row } from 'antd';
import _ from 'lodash';
import React from 'react';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import OBJECT_TYPE from '../const/objectTypes';
import ObjectCardView from '../../objectCard/ObjectCardView';

// eslint-disable-next-line import/prefer-default-export
export const getTagsLayout = self => {
  const tagsList = self.state.tagsList;
  const currObjId = self.props.wObject.author_permlink;
  return (
    <React.Fragment>
      {_.map(tagsList, (items, rowIndex) => {
        const itemsIdsToOmit = [currObjId];
        return (
          <React.Fragment key={`allowWrap${rowIndex}`}>
            <div className="NewsFiltersRule-title AppendForm__appendTitles">{`${self.props.intl.formatMessage(
              {
                id: 'tag',
                defaultMessage: 'tag',
              },
            )} ${rowIndex + 1}`}</div>
            <Row className="NewsFiltersRule-line">
              {tagsList.length < 10 && (
                <React.Fragment>
                  <SearchObjectsAutocomplete
                    handleSelect={self.handleAddObjectToTagsList}
                    objectType={OBJECT_TYPE.HASHTAG}
                    itemsIdsToOmit={itemsIdsToOmit}
                    rowIndex={rowIndex}
                    placeholder="Please select"
                  />
                </React.Fragment>
              )}
              {self.state.tagsList && <ObjectCardView wObject={self.state.tagsList[rowIndex]} />}
            </Row>
          </React.Fragment>
        );
      })}
      {tagsList && (
        <div role="presentation" className="NewLineButton" onClick={self.addNewTagsLine}>
          <Icon type="plus-circle" />
          {self.props.intl.formatMessage({
            id: 'addNewTag',
            defaultMessage: 'Add new tag',
          })}
        </div>
      )}
    </React.Fragment>
  );
};
