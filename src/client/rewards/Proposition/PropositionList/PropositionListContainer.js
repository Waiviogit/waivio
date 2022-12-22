import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import PropositionList from './PropositionList';
import { getAuthenticatedUser } from '../../../../store/authStore/authSelectors';
import { getLocale } from '../../../../store/settingsStore/settingsSelectors';

const PropositionListContainer = ({
  wobject,
  userName,
  locale,
  match,
  history,
  user,
  catalogHandleSortChange,
  catalogSort,
  isCatalogWrap,
  isLoadingFlag,
  location,
  listItems,
  isSortCustomExist,
  nestedObj,
}) => {
  const parentPermlink = get(wobject, 'parent.author_permlink', '');

  return (
    <PropositionList
      isCatalogWrap={isCatalogWrap}
      catalogHandleSortChange={catalogHandleSortChange}
      catalogSort={catalogSort}
      wobject={wobject}
      user={user}
      match={match}
      userName={userName}
      history={history}
      isLoadingFlag={isLoadingFlag}
      parentPermlink={parentPermlink}
      location={location}
      locale={locale}
      listItems={listItems}
      isCustomExist={isSortCustomExist}
      nestedObj={nestedObj}
    />
  );
};

PropositionListContainer.propTypes = {
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  locale: PropTypes.string,
  match: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
  catalogHandleSortChange: PropTypes.func,
  catalogSort: PropTypes.string.isRequired,
  isCatalogWrap: PropTypes.bool,
  isLoadingFlag: PropTypes.bool,
  location: PropTypes.shape().isRequired,
  listItems: PropTypes.shape(),
  isSortCustomExist: PropTypes.bool,
  nestedObj: PropTypes.shape().isRequired,
};

PropositionListContainer.defaultProps = {
  locale: 'en-US',
  match: {},
  user: {},
  assignPropos: () => {},
  declinePropos: () => {},
  isCatalogWrap: false,
  catalogGetMenuList: () => {},
  catalogHandleSortChange: () => {},
  campaigns: {},
  isLoadingPropositions: false,
  isLoadingFlag: false,
  currentHash: '',
  listItems: [],
  isSortCustomExist: false,
};

export default connect(state => ({
  locale: getLocale(state),
  user: getAuthenticatedUser(state),
}))(withRouter(PropositionListContainer));
