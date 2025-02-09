import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { sortBy, isEqual, size, map } from 'lodash';
import { Checkbox } from 'antd';
import { getDraftsList } from '../../../store/draftsStore/draftsActions';
import {
  getDraftPostsSelector,
  getDraftLoadingSelector,
  getPendingDraftSelector,
} from '../../../store/draftsStore/draftsSelectors';
import Loading from '../../components/Icon/Loading';
import DraftRow from './DraftRow';
import DeleteDraftModal from './DeleteDraftModal';
import requiresLogin from '../../auth/requiresLogin';

import './Drafts.less';

const Drafts = ({ loading, draftPosts, pendingDrafts, getDraftsListAct }) => {
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedDrafts, setSelectedDrafts] = useState([]);

  useEffect(() => {
    getDraftsListAct();
  }, []);

  const handleCheckAll = useCallback(
    e => {
      const { checked } = e.target;

      setSelectedDrafts(checked ? map(draftPosts, d => d.draftId) : []);
    },
    [draftPosts],
  );

  const handleCheck = useCallback((id, checked) => {
    setSelectedDrafts(prevSelectedDrafts =>
      checked ? [...prevSelectedDrafts, id] : prevSelectedDrafts.filter(draft => draft !== id),
    );
  }, []);

  const showModal = useCallback(() => {
    setShowModalDelete(true);
  }, []);

  const hideModal = useCallback(() => {
    setShowModalDelete(false);
  }, []);

  const sortedDraftPosts = sortBy(draftPosts, draft => new Date(draft.lastUpdated)).reverse();
  const noDrafts = !loading && draftPosts?.length === 0;

  return (
    <div className="Drafts">
      <div>
        <h1>
          <FormattedMessage id="drafts" defaultMessage="Drafts" />
        </h1>
        <h3>
          <FormattedMessage
            id="drafts_description"
            defaultMessage="These are posts that were never made public. You can publish them or delete them."
          />
        </h3>
      </div>
      {loading && <Loading center={false} />}
      {!loading && size(draftPosts) !== 0 && (
        <div className="Drafts__toolbar">
          <Checkbox
            checked={isEqual(
              selectedDrafts,
              map(draftPosts, d => d.draftId),
            )}
            onChange={handleCheckAll}
          />
          <div>
            <a role="presentation" className="Drafts__toolbar__delete" onClick={showModal}>
              <i className="iconfont icon-trash Drafts__toolbar__delete__icon" />
              <FormattedMessage id="delete_selected" defaultMessage="Delete selected" />
            </a>
          </div>
        </div>
      )}
      {noDrafts && (
        <h3 className="text-center">
          <FormattedMessage id="drafts_empty" defaultMessage="You don't have any draft saved" />
        </h3>
      )}
      {!loading && (
        <React.Fragment>
          {showModalDelete && (
            <DeleteDraftModal draftIds={selectedDrafts} onCancel={hideModal} onDelete={hideModal} />
          )}
          {map(sortedDraftPosts, draft => (
            <DraftRow
              key={draft.draftId}
              draft={draft}
              id={draft.draftId}
              selected={selectedDrafts.includes(draft.draftId)}
              pending={pendingDrafts.includes(draft.draftId)}
              onCheck={handleCheck}
            />
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

Drafts.propTypes = {
  loading: PropTypes.bool,
  draftPosts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  pendingDrafts: PropTypes.arrayOf(PropTypes.string),
  getDraftsListAct: PropTypes.func,
};

Drafts.defaultProps = {
  reloading: false,
  pendingDrafts: [],
  reload: () => {},
};

const mapStateToProps = state => ({
  loading: getDraftLoadingSelector(state),
  draftPosts: getDraftPostsSelector(state),
  pendingDrafts: getPendingDraftSelector(state),
});

export default requiresLogin(
  injectIntl(connect(mapStateToProps, { getDraftsListAct: getDraftsList })(Drafts)),
);
