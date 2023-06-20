import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import BodyContainer from '../../containers/Story/BodyContainer';
import { getObject } from '../../../waivioApi/ApiClient';

import './PageContent.less';

const PageContent = () => {
  const [content, setContent] = useState('');
  const { name } = useParams();

  useEffect(() => {
    getObject(name).then(res => setContent(res.pageContent));
  }, [name]);

  return (
    <div className={'PageContent'}>
      <BodyContainer full body={content} />
    </div>
  );
};

export default PageContent;
