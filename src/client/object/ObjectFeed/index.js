import React from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import ObjectFeed from './ObjectFeed';
import { getIsAuthenticated, getSuitableLanguage } from '../../reducers';
import IconButton from '../../components/IconButton';
import { getClientWObj } from '../../adapters';

const propTypes = {
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
};

const ObjectFeedContainer = ({ history, match, wobject }) => {
  /* redux store */
  const isAuthenticated = useSelector(getIsAuthenticated);
  const usedLocale = useSelector(getSuitableLanguage);

  const handleCreatePost = () => {
    if (wobject && wobject.author_permlink) {
      let redirectUrl = `/editor?object=`;
      redirectUrl += encodeURIComponent(`[${wobject.name}](${wobject.author_permlink})`);
      if (!isEmpty(wobject.parent)) {
        const parentObject = getClientWObj(wobject.parent, usedLocale);
        redirectUrl += `&object=${encodeURIComponent(
          `[${parentObject.name}](${parentObject.author_permlink})`,
        )}`;
      }
      history.push(redirectUrl);
    }
  };

  return (
    <React.Fragment>
      {isAuthenticated && (
        <div className="object-feed__row justify-end">
          <IconButton
            icon={<Icon type="plus-circle" />}
            onClick={handleCreatePost}
            caption={<FormattedMessage id="write_new_review" defaultMessage="Write new review" />}
          />
        </div>
      )}
      <ObjectFeed match={match} />
    </React.Fragment>
  );
};

ObjectFeedContainer.propTypes = propTypes;

export default ObjectFeedContainer;
