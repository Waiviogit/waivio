import React from 'react';
import { map } from 'lodash';
import { Icon } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { andLayout } from '../../../../../common/helpers/AppendFormHelper';
import ObjectCard from '../../../../components/Sidebar/ObjectCard';
import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';
import './GroupForms.less';

const ExpertiseForm = props => (
  <React.Fragment>
    {map(props.allowList, (items, rowIndex) => {
      let ruleIndex = 0;
      const itemsIdsToOmit = [props.currObjId];

      return (
        <React.Fragment key={`allowWrap${rowIndex}`}>
          <div className="NewsFiltersRule-title AppendForm__appendTitles">{`${props.intl.formatMessage(
            {
              id: 'expertise_tags',
              formattedMessage: 'Expertise tags',
            },
          )}`}</div>
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
            {
              // items.length < 5 &&
              <div className="NewsFiltersRule__line-search">
                <SearchObjectsAutocomplete
                  allowClear={false}
                  itemsIdsToOmit={itemsIdsToOmit}
                  rowIndex={rowIndex}
                  ruleIndex={ruleIndex}
                  placeholder={props.intl.formatMessage({
                    id: 'find_an)object',
                    defaultMessage: 'Find an object',
                  })}
                  handleSelect={props.handleAddObjectToRule}
                />
                <p>Choose tags or objects in which users should have expertise.</p>
              </div>
            }
          </div>
        </React.Fragment>
      );
    })}
  </React.Fragment>
);

ExpertiseForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  allowList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleAddObjectToRule: PropTypes.func.isRequired,
  deleteRuleItem: PropTypes.func.isRequired,
  currObjId: PropTypes.string.isRequired,
};

export default injectIntl(ExpertiseForm);
