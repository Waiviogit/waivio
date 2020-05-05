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
  const [allPropositions, setPropositions] = useState([]);

  const getPropositions = username => {
    const reqData = { currentUserName: username };
    ApiClient.getPropositions(reqData).then(data => {
      setPropositions(data.campaigns);
    });
  };

  useEffect(() => {
    getPropositions(userName);
  }, []);

  const propositions = filter(
    allPropositions,
    proposition => proposition.required_object.author_permlink === match.params.name,
  );
  const currentProposition = get(propositions, ['0']);

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
        propositions={propositions}
        currentProposition={currentProposition}
      />
    </React.Fragment>
  );
};

ObjectFeedContainer.propTypes = propTypes;

export default ObjectFeedContainer;
