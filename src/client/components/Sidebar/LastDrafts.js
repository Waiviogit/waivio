import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { setCurrentDraft } from '../../../store/draftsStore/draftsActions';
import Loading from '../../components/Icon/Loading';
import './LastDrafts.less';
import './SidebarContentBlock.less';

const Draft = ({ draft }) => {
  const dispatch = useDispatch();

  return (
    <div className="LastDrafts__draft">
      <Link
        className="LastDrafts__draft__title"
        to={{ pathname: '/editor', search: `?draft=${draft.draftId}` }}
        onClick={() => {
          dispatch(setCurrentDraft(draft));
        }}
      >
        {draft.title ? (
          draft.title
        ) : (
          <FormattedMessage id="draft_untitled" defaultMessage="Untitled draft" />
        )}
      </Link>
      <div className="LastDrafts__draft__date">
        <FormattedRelative value={new Date(draft.lastUpdated)} />
      </div>
    </div>
  );
};

Draft.propTypes = {
  draft: PropTypes.shape({
    draftId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
};

Draft.defaultProps = {
  saving: false,
};

const LastDrafts = ({ drafts, loaded }) => {
  if (!loaded) {
    return <Loading />;
  }

  const empty = drafts.length === 0;

  return (
    <div className="LastDrafts SidebarContentBlock">
      <h4 className="SidebarContentBlock__title">
        <i className="iconfont icon-write SidebarContentBlock__icon" />{' '}
        <FormattedMessage id="last_drafts" defaultMessage="Last drafts" />
      </h4>
      <div className="SidebarContentBlock__content">
        {empty && (
          <FormattedMessage id="drafts_empty" defaultMessage="You don't have any draft saved" />
        )}
        {drafts.map(d => (
          <Draft key={d.draftId} draft={d} />
        ))}
        {!empty && (
          <h4 className="LastDrafts__more">
            <Link to={'/drafts'}>
              <FormattedMessage id="show_more" defaultMessage="Show more" />
            </Link>
          </h4>
        )}
      </div>
    </div>
  );
};

LastDrafts.propTypes = {
  drafts: PropTypes.arrayOf(
    PropTypes.shape({
      draftId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      length: PropTypes.number,
      body: PropTypes.string,
    }),
  ),
  loaded: PropTypes.bool,
};

LastDrafts.defaultProps = {
  drafts: [],
  loaded: false,
};

export default withRouter(LastDrafts);
