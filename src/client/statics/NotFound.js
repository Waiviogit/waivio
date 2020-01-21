import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import ObjectAvatar from '../components/ObjectAvatar';

const NotFound = ({ item, title, titleDefault }) => (
  <div className="shifted">
    <div className="center flex flex-column items-center container">
      <Link to={`/`}>
        <ObjectAvatar size={60} />
      </Link>
      <h1>
        <FormattedMessage id={title} defaultMessage={titleDefault} values={{ item }} />
      </h1>
      <h3>
        <FormattedMessage
          id="not_to_worry"
          defaultMessage="Not to worry. You can head back to {link}"
          values={{
            link: (
              <Link to={`/`}>
                <FormattedMessage id="homepage" defaultMessage="the home page" />
              </Link>
            ),
          }}
        />
      </h3>
    </div>
  </div>
);

NotFound.propTypes = {
  item: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  titleDefault: PropTypes.string.isRequired,
};

export default NotFound;
