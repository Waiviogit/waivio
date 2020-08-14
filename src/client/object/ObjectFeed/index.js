import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty, filter, get } from 'lodash';
import ObjectFeed from './ObjectFeed';
import { getIsAuthenticated, getSuitableLanguage } from '../../reducers';
import IconButton from '../../components/IconButton';
import { getClientWObj } from '../../adapters';
import * as ApiClient from '../../../waivioApi/ApiClient';

const propTypes = {
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
};

const ObjectFeedContainer = ({ history, match, wobject, userName }) => {
  /* redux store */
  const isAuthenticated = useSelector(getIsAuthenticated);
  const usedLocale = useSelector(getSuitableLanguage);
  const [allPropositions, setAllPropositions] = useState([]);
  const [needUpdate, setNeedUpdate] = useState(true);

  const getPropositions = username => {
    setNeedUpdate(false);
    const requiredObject = wobject ? get(wobject, ['parent', 'author_permlink']) : '';
    ApiClient.getPropositions({ userName: username, match, requiredObject }).then(data => {
      setAllPropositions(data.campaigns);
    });
  };

  useEffect(() => {
    if (needUpdate) {
      getPropositions(userName);
    }
  }, [wobject]);

  const currentProposition = filter(
    allPropositions,
    obj => obj.required_object.author_permlink === match.params.name,
  );

  const handleCreatePost = () => {
    if (wobject && wobject.author_permlink) {
      let redirectUrl = `/editor?object=`;
      redirectUrl += encodeURIComponent(
        `[${wobject.name || wobject.default_name}](${wobject.author_permlink})`,
      );
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
            caption={<FormattedMessage id="write_new_review" defaultMessage="Write a new review" />}
          />
        </div>
      )}
      <ObjectFeed
        match={match}
        userName={userName}
        history={history}
        handleCreatePost={handleCreatePost}
        wobject={wobject}
        currentProposition={currentProposition}
      />
    </React.Fragment>
  );
};

ObjectFeedContainer.propTypes = propTypes;

export default ObjectFeedContainer;
