import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { has } from 'lodash';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';

const SocialBookAuthors = ({ authors }) => {
  const [newAuthors, setNewAuthors] = useState([]);

  const getAuthors = async () => {
    const authorsArr = await authors.reduce(async (acc, curr) => {
      const res = await acc;
      const permlink = curr.authorPermlink || curr.author_permlink;

      if (permlink && !has(curr, 'name')) {
        const newObj = await getObjectInfo([permlink], this.props.locale);

        return [...res, newObj.wobjects[0]];
      }

      return [...res, curr];
    }, []);

    setNewAuthors(authorsArr);
  };

  useEffect(() => {
    getAuthors();
  }, [authors]);

  return (
    <div className="SocialProduct__authors">
      <FormattedMessage id={'by'} defaultMessage={'By'} />

      {newAuthors.map((a, i) => (
        <>
          <span className={'ml1'}>
            {a.author_permlink || a.authorPermlink ? (
              <Link key={a.defaultShowLink} to={a.defaultShowLink}>
                {a.name}
              </Link>
            ) : (
              <span key={a.defaultShowLink}>{a.name}</span>
            )}
          </span>
          {i !== newAuthors.length - 1 && ','}
          {'  '}
        </>
      ))}
    </div>
  );
};

SocialBookAuthors.propTypes = {
  authors: PropTypes.arrayOf(),
};
export default SocialBookAuthors;
