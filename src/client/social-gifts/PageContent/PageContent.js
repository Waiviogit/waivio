import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import BodyContainer from '../../containers/Story/BodyContainer';
import { getObject } from '../../../waivioApi/ApiClient';
import { getLastPermlinksFromHash, getObjectName } from '../../../common/helpers/wObjectHelper';
import { getIsSocial } from '../../../store/appStore/appSelectors';

import './PageContent.less';

const PageContent = ({ wobj, intl }) => {
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

  return content ? (
    <div className={classnames('PageContent', { social: isSocial })}>
      <BodyContainer isPage full body={content} />
    </div>
  ) : (
    <div className={'Checklist__empty'}>
      {intl.formatMessage({
        id: 'page_empty',
        defaultMessage: 'There is no content on the page',
      })}
    </div>
  );
};

PageContent.propTypes = {
  wobj: PropTypes.shape(),
  intl: PropTypes.shape(),
};
export default injectIntl(PageContent);
