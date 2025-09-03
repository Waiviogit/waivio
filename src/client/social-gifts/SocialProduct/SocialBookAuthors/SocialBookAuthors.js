import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { has } from 'lodash';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import { getUsedLocale } from '../../../../store/appStore/appSelectors';

const SocialBookAuthors = ({ authors, intl }) => {
  const [newAuthors, setNewAuthors] = useState([]);
  const locale = useSelector(getUsedLocale);

  const getAuthors = async () => {
    const authorsArr = await authors.reduce(async (acc, curr) => {
      const res = await acc;
      const permlink = curr.authorPermlink || curr.author_permlink;

      if (permlink && !has(curr, 'name')) {
        const newObj = await getObjectInfo([permlink], locale);

        return [...res, newObj.wobjects[0]];
      }

      return [...res, curr];
    }, []);

    setNewAuthors(authorsArr);
  };

  const getPermlink = a => a.author_permlink || a.authorPermlink;

  useEffect(() => {
    getAuthors();
  }, [authors]);

  return (
    <div className="SocialProduct__authors">
      <span>{intl.formatMessage({ id: 'by_only', defaultMessage: 'By' })}</span>
      {newAuthors.map((a, i) => (
        <>
          <span className={'ml1'}>
            {getPermlink(a) ? (
              <Link key={getPermlink(a)} to={`/object/${getPermlink(a)}`}>
                {a.name}
              </Link>
            ) : (
              <Link to={`/discover-objects/book?search=${a.name}`} key={a.name}>
                {a.name}
              </Link>
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
  authors: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(SocialBookAuthors);
