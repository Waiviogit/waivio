import React, { useCallback, useEffect, useState } from 'react';
import { debounce, isEmpty } from 'lodash';
import { AutoComplete, Button, Icon, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { searchAutoComplete } from '../../../../../store/searchStore/searchActions';
import { getObjectName, getObjectUrlForLink } from '../../../../../common/helpers/wObjectHelper';
import Avatar from '../../../../components/Avatar';
import ObjectAvatar from '../../../../components/ObjectAvatar';
import UserSearchItem from '../../../../search/SearchItems/UserSearchItem';
import ObjectSearchCard from '../../../../components/ObjectSearchCard/ObjectSearchCard';
import {
  getAutoCompleteSearchResults,
  getIsStartSearchAutoComplete,
} from '../../../../../store/searchStore/searchSelectors';
import { pendingSearch } from '../../../../search/helpers';
import { getObject } from '../../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../../store/authStore/authSelectors';

import './BaseObjSettings.less';
import { userMenuTabsList } from '../../../../social-gifts/Header/TopNavigation/WebsiteTopNavigation';
import DnDItems from './DnDItems';

const BaseObjSettings = ({
  handleSubmit,
  intl,
  shopSettings,
  hideActions,
  tabsFilter,
  handleSubmitTabFilters,
  tabsSorting,
}) => {
  const dispatch = useDispatch();
  const autoCompleteSearchResults = useSelector(getAutoCompleteSearchResults);
  const loading = useSelector(getIsStartSearchAutoComplete);
  const account = useSelector(getAuthenticatedUserName);
  const [selectedObj, setSelectedObj] = useState(null);
  const [edit, setEdit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState(tabsFilter);
  const [sortedTabs, setSortedTabs] = useState(
    isEmpty(tabsSorting) ? userMenuTabsList : tabsSorting,
  );
  const dataSource =
    isEmpty(autoCompleteSearchResults) || loading
      ? []
      : [...autoCompleteSearchResults.users, ...autoCompleteSearchResults.wobjects].filter(
          item => item.object_type !== 'hashtag',
        );
  const handleAutoCompleteSearch = useCallback(
    debounce(
      value =>
        dispatch(
          searchAutoComplete(value, 3, 50, null, true, [
            'business',
            'place',
            'link',
            'book',
            'product',
            'restaurant',
          ]),
        ),
      300,
    ),
    [],
  );

  useEffect(() => {
    if (shopSettings?.type) {
      if (shopSettings.type === 'user') {
        setSelectedObj({
          account: shopSettings.value,
        });
      } else {
        getObject(shopSettings.value).then(res => setSelectedObj(res));
      }
    }
  }, [shopSettings.value]);

  const resetMainObj = () => {
    const currAcc = {
      account,
    };

    setFilters([]);
    setSelectedObj(currAcc);
    handleSubmit(currAcc);
  };

  const getOptionName = op => op.account || getObjectName(op);
  const changeTabFilters = (event, tab) => {
    const isChecked = event.target.checked;

    setFilters(() => {
      if (!isChecked && !filters?.includes(tab)) {
        return [...filters, tab];
      } else if (isChecked) {
        return filters?.filter(filter => filter !== tab);
      }

      return filters;
    });
  };
  const submitFilters = () => {
    handleSubmitTabFilters(filters, sortedTabs);
    setShowDetails(false);
  };

  return (
    <div>
      {!edit && selectedObj ? (
        <div className="BaseObjSettings__searchCard">
          <Link
            to={selectedObj.account ? `/@${selectedObj.account}` : getObjectUrlForLink(selectedObj)}
            className="BaseObjSettings__content"
          >
            {selectedObj.account ? (
              <Avatar username={selectedObj.account} size={40} />
            ) : (
              <ObjectAvatar item={selectedObj} size={40} />
            )}
            <span className="BaseObjSettings__name">{getOptionName(selectedObj)}</span>
          </Link>
          <b className="BaseObjSettings__type">
            {selectedObj.account ? 'user' : selectedObj.object_type}
          </b>
          {selectedObj.account !== account && (
            <span className="BaseObjSettings__clear" onClick={resetMainObj}>
              <Icon type="close-circle" />
            </span>
          )}
        </div>
      ) : (
        <AutoComplete
          onSearch={handleAutoCompleteSearch}
          placeholder={intl.formatMessage({
            id: 'find_object',
            defaultMessage: 'Find object',
          })}
          dropdownClassName={'BaseObjSettings__resultList'}
          allowClear
          dataSource={
            loading
              ? pendingSearch('', intl)
              : dataSource.map(o => (
                  <AutoComplete.Option
                    value={getOptionName(o)}
                    key={o.account || o.author_permlink}
                    label={getOptionName(o)}
                    onClick={() => {
                      setFilters([]);
                      setSelectedObj(o);
                      handleSubmit(o);
                      setEdit(false);
                    }}
                    className={'BaseObjSettings__resulItem'}
                  >
                    {o.account ? (
                      <UserSearchItem user={o} withType hideActions={hideActions} />
                    ) : (
                      <ObjectSearchCard
                        object={o}
                        name={getObjectName(o)}
                        type={o.type || o.object_type}
                      />
                    )}
                  </AutoComplete.Option>
                ))
          }
        />
      )}
      <Button type={'primary'} onClick={() => setEdit(!edit)}>
        {edit
          ? intl.formatMessage({ id: 'view', defaultMessage: 'View' })
          : intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
      </Button>
      {selectedObj?.account && !edit && (
        <button
          onClick={() => setShowDetails(true)}
          className="main-color-button BaseObjSettings__details"
        >
          {intl.formatMessage({
            id: 'details',
            defaultMessage: 'Details',
          })}
        </button>
      )}
      {showDetails && (
        <Modal
          okButtonProps={{ disabled: filters?.length === userMenuTabsList?.length }}
          title={'Base object details'}
          onOk={submitFilters}
          visible={showDetails}
          onCancel={() => setShowDetails(false)}
        >
          <div className={'flex flex-column'}>
            <div className={'BaseObjSettings__tab'}>Tabs to be displayed on the site:</div>
            <div className={'BaseObjSettings__tabs-list'}>
              <DnDItems
                filters={filters}
                changeTabFilters={changeTabFilters}
                sortedTabs={sortedTabs}
                setSortedTabs={setSortedTabs}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

BaseObjSettings.propTypes = {
  intl: PropTypes.shape().isRequired,
  tabsFilter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tabsSorting: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  shopSettings: PropTypes.shape({
    value: PropTypes.string,
    type: PropTypes.string,
  }),
  handleSubmit: PropTypes.string,
  handleSubmitTabFilters: PropTypes.string.isRequired,
  hideActions: PropTypes.bool,
};

export default injectIntl(BaseObjSettings);
