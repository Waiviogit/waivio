import React from 'react';
import { Checkbox, Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty, map } from 'lodash';
import { andLayout } from '../../../common/helpers/AppendFormHelper';
import ObjectCard from '../../components/Sidebar/ObjectCard';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';

const SecondPage = ({
  intl,
  tagsList,
  setTagsList,
  lists,
  setLists,
  objects,
  checkedIds,
  setCheckedIds,
}) => {
  const setCheckedObjs = obj => {
    if (checkedIds?.includes(obj.id)) {
      setCheckedIds(checkedIds?.filter(id => id !== obj.id));
    } else {
      setCheckedIds([...checkedIds, obj.id]);
    }
  };
  const handleAddObjectToRule = (obj, list, setList) => {
    setList([...list, obj]);
  };

  const handleRemoveObject = (id, list, setList) => {
    setList(list.filter(o => o.author_permlink !== id));
  };
  const tagsToOmit = [];
  const listsToOmit = [];

  if (isEmpty(objects))
    return <div className={'flex justify-center'}>No objects were found in the selected area.</div>;

  return (
    <div>
      <div className={'MapObjectImportModal__title-text'}>Google Maps found objects:</div>
      <div>
        {objects?.map(obj => (
          <div key={obj?.id} className={'MapObjectImportModal__obj-wrap'}>
            {' '}
            <Checkbox
              checked={checkedIds?.includes(obj?.id)}
              onChange={() => setCheckedObjs(obj)}
            />
            <span className={'MapObjectImportModal__obj-name'}>{obj?.displayName?.text}</span>
          </div>
        ))}
      </div>
      <br />
      <div className={'MapObjectImportModal__title-text'}>Tags (optional):</div>
      <div className="NewsFiltersRule__line">
        <div className="NewsFiltersRule__card-wrap">
          {map(tagsList, (item, index) => {
            tagsToOmit.push(item.author_permlink);

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
                      onClick={() =>
                        handleRemoveObject(item.author_permlink, tagsList, setTagsList)
                      }
                    />
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {
        <React.Fragment>
          <div className="NewsFiltersRule__line-search">
            <SearchObjectsAutocomplete
              autoFocus={false}
              objectType="hashtag"
              itemsIdsToOmit={tagsToOmit}
              placeholder={intl.formatMessage({
                id: 'select_tags_for_imported_objects',
                defaultMessage: 'Select tags for imported objects',
              })}
              handleSelect={item => handleAddObjectToRule(item, tagsList, setTagsList)}
            />
          </div>
        </React.Fragment>
      }

      <div className={'MapObjectImportModal__title-text'}>List (optional):</div>
      <div className="NewsFiltersRule__line">
        <div className="NewsFiltersRule__card-wrap">
          {map(lists, (item, index) => {
            listsToOmit.push(item.author_permlink);

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
                      onClick={() => handleRemoveObject(item.author_permlink, lists, setLists)}
                    />
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {
        <React.Fragment>
          <div className="NewsFiltersRule__line-search">
            <SearchObjectsAutocomplete
              useExtendedSearch
              autoFocus={false}
              objectType="list"
              itemsIdsToOmit={listsToOmit}
              placeholder={intl.formatMessage({
                id: 'select_lists_for_imported_objects',
                defaultMessage: 'Select lists to add the imported objects',
              })}
              handleSelect={item => handleAddObjectToRule(item, lists, setLists)}
            />
          </div>
        </React.Fragment>
      }
      <br />
    </div>
  );
};

SecondPage.propTypes = {
  intl: PropTypes.shape().isRequired,
  setTagsList: PropTypes.func.isRequired,
  setLists: PropTypes.func.isRequired,
  setCheckedIds: PropTypes.func.isRequired,
  tagsList: PropTypes.arrayOf().isRequired,
  lists: PropTypes.arrayOf().isRequired,
  checkedIds: PropTypes.arrayOf().isRequired,
  objects: PropTypes.arrayOf().isRequired,
};

export default injectIntl(SecondPage);
