import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import PropTypes from 'prop-types';
import BodyContainer from '../../containers/Story/BodyContainer';
import { getObject } from '../../../waivioApi/ApiClient';

import './PageContent.less';
import { getLastPermlinksFromHash, getObjectName } from '../../../common/helpers/wObjectHelper';

const PageContent = ({ wobj }) => {
  const [content, setContent] = useState('');
  const { name } = useParams();
  const location = useLocation();
  const objName = location.hash ? getLastPermlinksFromHash(location.hash) : name;

  useEffect(() => {
    if (wobj) {
      setContent(wobj.pageContent);
      if (window.gtag) window.gtag('event', getObjectName(wobj), { debug_mode: true });
    } else {
      getObject(objName).then(res => {
        setContent(res.pageContent);
        if (window.gtag) window.gtag('event', getObjectName(res), { debug_mode: true });
      });
    }
  }, [objName]);

  return (
    <div className={'PageContent'}>
      <BodyContainer full body={content} />
    </div>
  );
};

PageContent.propTypes = {
  wobj: PropTypes.shape(),
};

PageContent.fetchData = ({ store, match, query }) => {
  const objName = query ? query.get('currObj') : match.params.name;

  store.dispatch(getObject(objName));
};
export default PageContent;
