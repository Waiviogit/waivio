import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import BodyContainer from '../../containers/Story/BodyContainer';
import { getObject } from '../../../waivioApi/ApiClient';

import './PageContent.less';
import { getLastPermlinksFromHash, getObjectName } from '../../../common/helpers/wObjectHelper';
import { getIsSocial } from '../../../store/appStore/appSelectors';

const PageContent = ({ wobj }) => {
  const [content, setContent] = useState(wobj.pageContent || '');
  const { name } = useParams();
  const location = useLocation();
  const objName = location.hash ? getLastPermlinksFromHash(location.hash) : name;
  const isSocial = useSelector(getIsSocial);

  useEffect(() => {
    if (wobj) {
      setContent(wobj.pageContent);
      if (typeof window !== 'undefined' && window.gtag)
        window.gtag('event', getObjectName(wobj), { debug_mode: false });
    } else {
      getObject(objName).then(res => {
        setContent(res.pageContent);
        if (typeof window !== 'undefined' && window.gtag)
          window.gtag('event', getObjectName(res), { debug_mode: false });
      });
    }
  }, [objName]);

  return (
    <div className={classnames('PageContent', { social: isSocial })}>
      <BodyContainer isPage full body={content} />
    </div>
  );
};

PageContent.propTypes = {
  wobj: PropTypes.shape(),
};
export default PageContent;
