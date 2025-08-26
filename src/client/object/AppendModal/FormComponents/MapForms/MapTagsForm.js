import React from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { injectIntl } from 'react-intl';
import { orLayout } from '../../../../../common/helpers/AppendFormHelper';
import ObjectCard from '../../../../components/Sidebar/ObjectCard';
import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';

const MapTagsForm = props => (
  <div className={'MapTagsForm'}>
    {map(props.allowList, (items, rowIndex) => {
      let ruleIndex = 0;
      const itemsIdsToOmit = [props.currObjId];

      return (
        <React.Fragment key={`allowWrap${rowIndex}`}>
          <div className="NewsFiltersRule-title AppendForm__appendTitles">
            {props.intl.formatMessage({
              id: 'object_field_mapObjectTags',
              defaultMessage: 'Map tags',
            })}
          </div>
          <div className="NewsFiltersRule__line">
            <div className="NewsFiltersRule__card-wrap">
              {map(items, (item, index) => {
                ruleIndex = index + 1;
                itemsIdsToOmit.push(item.author_permlink);

                return (
                  <React.Fragment key={`allowList${ruleIndex}${item.author_permlink}`}>
                    {orLayout(index)}
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
            <div className="NewsFiltersRule__line-search">
              <SearchObjectsAutocomplete
                objectType={'hashtag'}
                allowClear={false}
                itemsIdsToOmit={itemsIdsToOmit}
                rowIndex={rowIndex}
                ruleIndex={ruleIndex}
                placeholder={props.intl.formatMessage({
                  id: 'select_a_tag',
                  defaultMessage: 'Select a tag',
                })}
                handleSelect={props.handleAddObjectToRule}
              />
              <p>
                {props.intl.formatMessage({
                  id: 'map_tags_note',
                  defaultMessage: 'Choose the tags for displaying objects on the map.',
                })}
              </p>
            </div>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

MapTagsForm.propTypes = {
  intl: PropTypes.shape(),
  allowList: PropTypes.arrayOf(PropTypes.shape()),
  handleAddObjectToRule: PropTypes.func,
  deleteRuleItem: PropTypes.func,
  currObjId: PropTypes.string,
};

export default injectIntl(MapTagsForm);
