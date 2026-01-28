import React, { useState, useCallback } from 'react';
import { AutoComplete } from 'antd';
import { debounce, isEmpty, map } from 'lodash';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { getPlural } from '../../../../discoverObjects/helper';

import UserSearchItem from '../../../../search/SearchItems/UserSearchItem';
import ObjectSearchItem from '../../../../search/SearchItems/ObjectSearchItem';

import { getObjectName } from '../../../../../common/helpers/wObjectHelper';
import { getTranformSearchCountData, pendingSearch } from '../../../../search/helpers';
import listOfObjectTypes from '../../../../../common/constants/listOfObjectTypes';

import {
  getAutoCompleteSearchResults,
  getIsStartSearchAutoComplete,
} from '../../../../../store/searchStore/searchSelectors';
import { searchAutoComplete } from '../../../../../store/searchStore/searchActions';

import './GeneralSearch.less';

const markers = {
  USER: 'user',
  WOBJ: 'wobj',
  TYPE: 'type',
  SELECT_BAR: 'searchSelectBar',
};

const GeneralSearch = props => {
  const [searchBarValue, setSeachValue] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const searchResults = useSelector(getAutoCompleteSearchResults);
  const loading = useSelector(getIsStartSearchAutoComplete);

  const getSocialLink = obj => `/object/${obj.author_permlink}`;

  const isSocialWobj = wobj =>
    props.isSocialProduct &&
    [
      'product',
      'book',
      'person',
      'business',
      'place',
      'link',
      'restaurant',
      'list',
      'recipe',
    ].includes(wobj.object_type);

  const debouncedSearch = useCallback(
    debounce(value => {
      dispatch(
        searchAutoComplete(value, 5, 15, undefined, true, [
          'product',
          'book',
          'business',
          'place',
          'link',
          'restaurant',
          'list',
          'recipe',
        ]),
      );
    }, 500),
    [],
  );

  const handleAutoCompleteSearch = value => {
    setSeachValue(value);
    setType(false);
    setOpen(Boolean(value));
    debouncedSearch(value);
  };

  const searchSelectBar = () => {
    const options = getTranformSearchCountData(searchResults, listOfObjectTypes);

    return (
      <AutoComplete.OptGroup className="Header__itemWrap">
        {map(options, option => (
          <AutoComplete.Option
            marker={markers.SELECT_BAR}
            key={`select${option.name}`}
            value={option.name}
            className={classNames({
              'Header__item--active': option.name === 'Types' && type,
            })}
          >
            {`${option.name}(${option.count})`}
          </AutoComplete.Option>
        ))}
      </AutoComplete.OptGroup>
    );
  };

  const usersSearchLayout = users => (
    <AutoComplete.OptGroup
      key="usersTitle"
      label={props.intl.formatMessage({
        id: 'users_search_title',
        defaultMessage: 'Users',
      })}
    >
      {map(users, user => (
        <AutoComplete.Option
          marker={markers.USER}
          key={`user${user.account}`}
          value={`user${user.account}`}
          className="Topnav__search-autocomplete"
        >
          <UserSearchItem user={user} />
        </AutoComplete.Option>
      ))}
    </AutoComplete.OptGroup>
  );

  const wobjectSearchLayout = wobjects => (
    <AutoComplete.OptGroup
      key="wobjectsTitle"
      label={props.intl.formatMessage({
        id: 'wobjects_search_title',
        defaultMessage: 'Objects',
      })}
    >
      {map(wobjects, wobj => {
        const link = isSocialWobj(wobj) ? getSocialLink(wobj) : wobj.defaultShowLink;

        return (
          <AutoComplete.Option
            marker={markers.WOBJ}
            key={`wobj${getObjectName(wobj)}`}
            value={`wobj${link}`}
            className="Topnav__search-autocomplete"
          >
            <ObjectSearchItem wobj={wobj} />
          </AutoComplete.Option>
        );
      })}
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
      {map(objectTypes, typeItem => (
        <AutoComplete.Option
          marker={markers.TYPE}
          key={`type${typeItem.name}`}
          value={`type${typeItem.name}`}
          className="Header__item"
        >
          {typeItem.name}
        </AutoComplete.Option>
      ))}
    </AutoComplete.OptGroup>
  );

  const prepareOptions = () => {
    const dataSource = [];

    if (!isEmpty(searchResults)) dataSource.push(searchSelectBar());
    if (!type) {
      if (!isEmpty(searchResults.wobjects))
        dataSource.push(wobjectSearchLayout(searchResults.wobjects.slice(0, 15)));
      if (!isEmpty(searchResults.users)) dataSource.push(usersSearchLayout(searchResults.users));
      if (!isEmpty(searchResults.objectTypes))
        dataSource.push(wobjectTypeSearchLayout(searchResults.objectTypes));
    }

    return dataSource;
  };

  const isSameTypeOrPlural = (searchValue, selectedType) => {
    if (!searchValue || !selectedType) return false;
    const lowerSearch = searchValue.toLowerCase().trim();
    const lowerType = selectedType.toLowerCase().trim();

    return lowerSearch === lowerType || lowerSearch === getPlural(lowerType);
  };

  const handleSelectOnAutoCompleteDropdown = (value, data) => {
    let redirectUrl = '';

    switch (data.props.marker) {
      case markers.USER:
        redirectUrl = `/@${value.replace('user', '')}`;
        break;

      case markers.WOBJ:
        redirectUrl = value.replace('wobj', '');
        break;

      case markers.TYPE:
        redirectUrl = `/discover-objects/${value.replace('type', '')}`;
        break;

      case markers.SELECT_BAR: {
        if (value === 'Types') {
          setType(prev => !prev);

          return;
        }

        const isUsers = value === 'Users';
        const mainLink = isUsers ? '/discover-users' : `/discover-objects/${value}`;
        const search =
          searchBarValue && (isUsers || !isSameTypeOrPlural(searchBarValue, value))
            ? `?search=${searchBarValue}`
            : '';

        redirectUrl = `${mainLink}${search}`;
        break;
      }

      default:
        break;
    }

    if (redirectUrl) {
      history.push(redirectUrl);
      setSeachValue('');
      setOpen(false);
      document?.activeElement?.blur();
    }
  };

  return (
    <div
      className={classNames('Header__search', {
        'Header__search--hidden': !props.searchBarActive,
        'Header__search--long': props.isSocialProduct,
      })}
    >
      <i className="iconfont icon-search" />

      <AutoComplete
        className="GeneralSearch__wrapper"
        value={searchBarValue}
        open={open}
        onChange={handleAutoCompleteSearch}
        onSelect={handleSelectOnAutoCompleteDropdown}
        onFocus={() => setOpen(Boolean(searchBarValue))}
        onBlur={() => setOpen(false)}
        allowClear
        backfill={false}
        defaultActiveFirstOption={false}
        optionLabelProp="value"
        dropdownClassName={`GeneralSearch ${props.dropdownClassName}`}
        placeholder={props.intl.formatMessage({
          id: 'search_placeholder',
          defaultMessage: 'What are you looking for?',
        })}
        dataSource={loading ? pendingSearch('', props.intl) : prepareOptions()}
      />
    </div>
  );
};

GeneralSearch.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  searchBarActive: PropTypes.bool,
  isSocialProduct: PropTypes.bool,
  dropdownClassName: PropTypes.string,
};

GeneralSearch.defaultProps = {
  dropdownClassName: '',
};

export default injectIntl(GeneralSearch);
