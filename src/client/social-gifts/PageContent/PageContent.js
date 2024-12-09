import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { size, unescape } from 'lodash';
import classnames from 'classnames';
import Lightbox from 'react-image-lightbox';
import PropTypes from 'prop-types';
import BodyContainer from '../../containers/Story/BodyContainer';
import { getObject } from '../../../waivioApi/ApiClient';
import { getLastPermlinksFromHash, getObjectName } from '../../../common/helpers/wObjectHelper';
import { getIsSocial } from '../../../store/appStore/appSelectors';

import { extractImageTags } from '../../../common/helpers/parser';
import { getHtml } from '../../components/Story/Body';
import './PageContent.less';

const PageContent = ({ wobj, intl }) => {
  const [content, setContent] = useState(wobj.pageContent || '');
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const { name } = useParams();
  const location = useLocation();
  const objName = location.hash ? getLastPermlinksFromHash(location.hash) : name;
  const isSocial = useSelector(getIsSocial);
  const parsedBody = getHtml(content, {}, 'text', { isPost: true });
  const contentDiv = useRef();

  const images = extractImageTags(parsedBody).map(image => ({
    ...image,
    src: unescape(image.src.replace('https://images.hive.blog/0x0/', '')),
  }));

  const imagesArraySize = size(images);

  const handleContentClick = e => {
    if (e.target.tagName === 'IMG' && images) {
      const tags = contentDiv.current?.getElementsByTagName('img');

      for (let i = 0; i < tags.length; i += 1) {
        if (tags[i] === e.target && images.length > i) {
          if (e.target?.parentNode && e.target?.parentNode.tagName === 'A') return;

          setIndex(i);
          setOpen(true);
        }
      }
    }
  };

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
    <div
      ref={contentDiv}
      className={classnames('PageContent', { social: isSocial })}
      onClick={handleContentClick}
    >
      <BodyContainer isPage full body={content} />
      {open && (
        <Lightbox
          wrapperClassName="LightboxTools"
          mainSrc={images[index].src}
          nextSrc={imagesArraySize > 1 && images[(index + 1) % imagesArraySize].src}
          prevSrc={
            imagesArraySize > 1 && images[(index + (imagesArraySize - 1)) % imagesArraySize].src
          }
          onCloseRequest={() => {
            setOpen(false);
          }}
          onMovePrevRequest={() => setIndex((index + (imagesArraySize - 1)) % imagesArraySize)}
          onMoveNextRequest={() => setIndex((index + (images.length + 1)) % images.length)}
        />
      )}
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
