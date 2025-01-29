import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isUndefined } from 'lodash';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { Checkbox } from 'antd';
import DeleteDraftModal from './DeleteDraftModal';
import './DraftRow.less';

const DraftRow = ({ id, draft, selected, onCheck }) => {
  const [showModalDelete, setShowModalDelete] = useState(false);

  const showModal = () => {
    setShowModalDelete(true);
  };

  const hideModal = () => {
    setShowModalDelete(false);
  };

  const handleCheck = e => {
    onCheck(id, e.target.checked);
  };

  const { lastUpdated } = draft;
  const hasLastUpdated = !isUndefined(lastUpdated);
  let { title = '', body = '' } = draft;

  title = title.trim();
  body = body.replace(/\r?\n|\r|[\u200B-\u200D\uFEFF]/g, ' ').substring(0, 50);
  let draftTitle = title.length ? title : body;

  draftTitle = draftTitle.trim();

  return (
    <div className="DraftRow">
      <div className="DraftRow__contents">
        <div className="DraftRow__contents__main">
          <Checkbox checked={selected} onChange={handleCheck} />
          <div>
            <Link to={{ pathname: '/editor', search: `?draft=${id}` }}>
              <h3>
                {draftTitle.length === 0 ? (
                  <FormattedMessage id="draft_untitled" defaultMessage="Untitled draft" />
                ) : (
                  draftTitle
                )}
              </h3>
            </Link>
            <span className="DraftRow__date">
              {hasLastUpdated && (
                <span>
                  <FormattedMessage id="last_updated" defaultMessage="Last updated" />{' '}
                  <FormattedRelative value={new Date(lastUpdated)} />
                </span>
              )}
            </span>
          </div>
        </div>

        <a role="presentation" onClick={showModal} className="DraftRow__delete">
          <i className="iconfont icon-trash DraftRow__delete__icon" />
          <FormattedMessage id="delete" defaultMessage="Delete" />
        </a>
      </div>
      {showModalDelete && (
        <DeleteDraftModal draftIds={[id]} onDelete={hideModal} onCancel={hideModal} />
      )}
    </div>
  );
};

DraftRow.propTypes = {
  id: PropTypes.string.isRequired,
  draft: PropTypes.shape({
    draftId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool,
  onCheck: PropTypes.func,
};

DraftRow.defaultProps = {
  selected: false,
  onCheck: () => {},
};

export default DraftRow;
