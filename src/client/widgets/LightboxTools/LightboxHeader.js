import React from 'react';
import * as PropType from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Avatar from '../../components/Avatar';
import './LightboxTools.less';
import ObjectAvatar from '../../components/ObjectAvatar';

const LightboxHeader = ({
  objName,
  userName,
  albumName,
  relatedWobjs,
  relatedPath,
  closeModal,
}) => (
  <div className="LightboxTools__container">
    <div className="ObjectCard">
      <div className="ObjectCard__top">
        {userName && (
          <div className="ObjectCard__links">
            <Link to={`/@${userName}`} title={userName}>
              <Avatar username={userName} size={34} lightbox />
            </Link>
            <Link to={`/@${userName}`} title={userName} className="LightboxTools__name">
              {userName}
            </Link>
          </div>
        )}
      </div>
    </div>

    <div className="LightboxTools__albumInfo-container">
      {objName && albumName && (
        <>
          <span className="LightboxTools__albumInfo-title">
            <FormattedMessage id="album" defaultMessage="Album" />:
          </span>
          <span className="LightboxTools__albumInfo">
            <b>{objName}:</b> {albumName}
          </span>
        </>
      )}
      {relatedWobjs && (
        <>
          <a onClick={closeModal} href={relatedPath} className="LightboxTools__albumInfo-title">
            <FormattedMessage id="related_wobjects" defaultMessage="Related objects" />:
          </a>
          <div className="LightboxTools__width">
            {relatedWobjs.slice(0, 4).map(wobj => (
              <div className="Story__published ml2" key={wobj.author_permlink}>
                <Link to={wobj.defaultShowLink}>
                  <ObjectAvatar item={wobj} size={34} className={'Avatar-lightbox'} />
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
);

LightboxHeader.propTypes = {
  userName: PropType.string,
  albumName: PropType.string,
  relatedPath: PropType.string,
  closeModal: PropType.func,
  relatedWobjs: PropType.arrayOf(),
  objName: PropType.string,
};
export default LightboxHeader;
