import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';

import BodyContainer from '../../containers/Story/BodyContainer';
import { getObject } from '../../../waivioApi/ApiClient';

import './PageContent.less';
import { getLastPermlinksFromHash } from '../../../common/helpers/wObjectHelper';

const PageContent = () => {
  const [content, setContent] = useState('');
  const { name } = useParams();
  const location = useLocation();
  const objName = location.hash ? getLastPermlinksFromHash(location.hash) : name;

  useEffect(() => {
    getObject(objName).then(res => setContent(res.pageContent));
  }, [objName]);

  return (
    <div className={'PageContent'}>
      <BodyContainer full body={content} />
    </div>
  );
};

export default PageContent;
