import React, { useCallback, useEffect, useState } from 'react';
import { debounce, isEmpty } from 'lodash';
import { AutoComplete, Button, Icon } from 'antd';
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

const BaseObjSettings = ({ handleSubmit, intl, shopSettings }) => {
  const dispatch = useDispatch();
  const autoCompleteSearchResults = useSelector(getAutoCompleteSearchResults);
  const loading = useSelector(getIsStartSearchAutoComplete);
  const account = useSelector(getAuthenticatedUserName);
  const [selectedObj, setSelectedObj] = useState(null);
  const [edit, setEdit] = useState(false);
  const dataSource =
    isEmpty(autoCompleteSearchResults) || loading
      ? []
      : [...autoCompleteSearchResults.users, ...autoCompleteSearchResults.wobjects].filter(
          item => item.object_type !== 'hashtag',
        );
  const handleAutoCompleteSearch = useCallback(
    debounce(
      value =>
        dispatch(searchAutoComplete(value, 3, 15, null, true, ['business', 'book', 'product'])),
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

    setSelectedObj(currAcc);
    handleSubmit(currAcc);
  };

  const getOptionName = op => op.account || getObjectName(op);

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
          placeholder={'Find object'}
          dropdownClassName={'BaseObjSettings__resultList'}
          allowClear
          dataSource={
            loading
              ? pendingSearch('', intl)
              : dataSource.map(o => (
                  <AutoComplete.Option
                    value={getOptionName(o)}
                    key={getOptionName(o)}
                    label={getOptionName(o)}
                    onClick={() => {
                      setSelectedObj(o);
                      handleSubmit(o);
                      setEdit(false);
                    }}
                    className={'BaseObjSettings__resulItem'}
                  >
                    {o.account ? (
                      <UserSearchItem user={o} withType />
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
        {edit ? 'View' : 'Edit'}
      </Button>
    </div>
  );
};

BaseObjSettings.propTypes = {
  intl: PropTypes.shape({}),
  shopSettings: PropTypes.shape({
    value: PropTypes.string,
    type: PropTypes.string,
  }),
  handleSubmit: PropTypes.string,
};

export default injectIntl(BaseObjSettings);
