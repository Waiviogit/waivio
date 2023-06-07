import React, { useState, useCallback } from 'react';
import { AutoComplete } from 'antd';
import { debounce, isEmpty, map } from 'lodash';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

// import UserSearchItem from '../../../search/SearchItems/UserSearchItem';
import { getObjectName } from '../../../../common/helpers/wObjectHelper';
import ObjectSearchItem from '../../../search/SearchItems/ObjectSearchItem';
import { getTranformSearchCountData, pendingSearch } from '../../../search/helpers';
import listOfObjectTypes from '../../../../common/constants/listOfObjectTypes';
import {
  getAutoCompleteSearchResults,
  getIsStartSearchAutoComplete,
} from '../../../../store/searchStore/searchSelectors';
import { searchAutoComplete } from '../../../../store/searchStore/searchActions';

const markers = {
  USER: 'user',
  WOBJ: 'wobj',
  TYPE: 'type',
  SELECT_BAR: 'searchSelectBar',
};

const GeneralSearch = props => {
  const [searchBarValue, setSeachValue] = useState();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const searchResults = useSelector(getAutoCompleteSearchResults);
  const loading = useSelector(getIsStartSearchAutoComplete);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleAutoCompleteSearchDebounce = useCallback(
    debounce(value => {
      dispatch(searchAutoComplete(value, 0, 15, undefined, true));
    }, 500),
    [],
  );

  const handleAutoCompleteSearch = value => {
    setSeachValue(value);
    setType(null);
    if (value) setOpen(true);
    else setOpen(false);

    handleAutoCompleteSearchDebounce(value);
  };

  const searchSelectBar = () => {
    const options = getTranformSearchCountData(searchResults, listOfObjectTypes);

    return (
      <AutoComplete.OptGroup className="Header__itemWrap">
        {map(options, option => (
          <AutoComplete.Option
            marker={'searchSelectBar'}
            key={option.name}
            value={option.name}
            className={classNames({ 'Header__item--active': option.name === 'Types' && type })}
          >
            {`${option.name}(${option.count})`}
          </AutoComplete.Option>
        ))}
      </AutoComplete.OptGroup>
    );
  };

  // const usersSearchLayout = accounts => (
  //   <AutoComplete.OptGroup
  //     key="usersTitle"
  //     label={props.intl.formatMessage({
  //       id: 'users_search_title',
  //       defaultMessage: 'Users',
  //     })}
  //   >
  //     {map(accounts, option => (
  //       <AutoComplete.Option
  //         marker={'user'}
  //         key={option.account}
  //         value={option.account}
  //         className="Topnav__search-autocomplete"
  //       >
  //         <UserSearchItem user={option} />
  //       </AutoComplete.Option>
  //     ))}
  //   </AutoComplete.OptGroup>
  // );

  const wobjectSearchLayout = wobjects => (
    <AutoComplete.OptGroup
      key="wobjectsTitle"
      label={props.intl.formatMessage({
        id: 'wobjects_search_title',
        defaultMessage: 'Objects',
      })}
    >
      {map(wobjects, option => (
        <AutoComplete.Option
          marker={markers.WOBJ}
          key={getObjectName(option)}
          value={option.defaultShowLink}
          className="Topnav__search-autocomplete"
        >
          <ObjectSearchItem wobj={option} />
        </AutoComplete.Option>
      ))}
    </AutoComplete.OptGroup>
  );

  const wobjectTypeSearchLayout = objectTypes => (
    <AutoComplete.OptGroup
      key="typesTitle"
      label={props.intl.formatMessage({
        id: 'wobjectType_search_title',
        defaultMessage: 'Types',
      })}
    >
      {map(objectTypes, option => (
        <AutoComplete.Option
          marker={markers.TYPE}
          key={option.name}
          value={option.name}
          className="Header__item"
        >
          <div>{option.name}</div>
        </AutoComplete.Option>
      ))}
    </AutoComplete.OptGroup>
  );

  const prepareOptions = () => {
    const dataSource = [];

    if (!isEmpty(searchResults)) {
      dataSource.push(searchSelectBar(searchResults));
    }

    if (!isEmpty(searchResults.wobjects))
      dataSource.push(wobjectSearchLayout(searchResults.wobjects.slice(0, 5)));
    // if (!isEmpty(searchResults.users)) dataSource.push(usersSearchLayout(searchResults.users));
    if (!isEmpty(searchResults.objectTypes))
      dataSource.push(wobjectTypeSearchLayout(searchResults.objectTypes));

    return type
      ? [searchSelectBar(searchResults), wobjectTypeSearchLayout(searchResults.objectTypes)]
      : dataSource;
  };

  const handleSelectOnAutoCompleteDropdown = (value, data) => {
    let redirectUrl = '';

    switch (data.props.marker) {
      // case markers.USER:
      //   redirectUrl = `/@${value}`;
      //   break;
      case markers.WOBJ:
        redirectUrl = value;
        break;
      case markers.SELECT_BAR: {
        if (value !== 'Types') {
          const isUsers = value === 'Users';
          const mainLink = isUsers ? '/discover' : `/discover-objects/${value}`;
          let search = searchBarValue ? `?search=${searchBarValue}` : '';

          if (isUsers && searchBarValue) {
            search = `/${searchBarValue}`;
          }

          redirectUrl = `${mainLink}${search}`;
        } else {
          setType(type ? null : markers.TYPE);
          setSeachValue(searchBarValue);
        }

        break;
      }

      default: {
        setType(null);
        redirectUrl = `/discover-objects/${value.replace('type', '')}`;
      }
    }

    if (redirectUrl) {
      history.push(redirectUrl);
      setSeachValue('');
      setOpen(false);
    }
  };

  return (
    <div
      className={classNames('Header__search', {
        'Header__search--hidden': !props.searchBarActive,
      })}
    >
      <i className={'iconfont icon-search'} />
      <AutoComplete
        open={open}
        onChange={handleAutoCompleteSearch}
        onSelect={handleSelectOnAutoCompleteDropdown}
        placeholder={'What are you looking for?'}
        dropdownClassName={'BaseObjSettings__resultList'}
        allowClear
        optionLabelProp="value"
        dataSource={loading ? pendingSearch('', props.intl) : prepareOptions()}
        value={searchBarValue}
      />{' '}
    </div>
  );
};

GeneralSearch.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  searchBarActive: PropTypes.bool,
};

export default injectIntl(GeneralSearch);
