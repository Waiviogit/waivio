import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getReferenceObjectsList } from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { getUsedLocale } from '../../../../store/appStore/appSelectors';
import ObjectReferenceItem from './ObjectReferenceItem';

const ObjectReference = ({ wobject, isCenterContent }) => {
  const [references, setReferences] = useState([]);
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);

  useEffect(() => {
    getReferenceObjectsList({
      authorPermlink: wobject.author_permlink,
      userName,
      locale,
    }).then(res => setReferences(Object.entries(res)));
  }, [wobject.author_permlink]);

  return references.map(ref => (
    <ObjectReferenceItem
      key={ref[0]}
      wobject={wobject}
      objects={ref[1]}
      refType={ref[0]}
      isCenterContent={isCenterContent}
    />
  ));
};

ObjectReference.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool.isRequired,
};

export default ObjectReference;
