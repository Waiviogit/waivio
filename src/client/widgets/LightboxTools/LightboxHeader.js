import React from 'react';
import { Select } from 'antd';
import { isEmpty } from 'lodash';
import * as PropType from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Avatar from '../../components/Avatar';
import ObjectAvatar from '../../components/ObjectAvatar';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
// import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import { objectFields } from '../../../common/constants/listOfFields';
import './LightboxTools.less';

const LightboxHeader = ({
  userName,
  albumName,
  relatedWobjs,
  relatedPath,
  closeModal,
  wobject,
  albums,
  setField,
  setShowModal,
  setSelectedAlbum,
  isPost,
}) => {
  const avatarOption = 'Set as avatar picture';
  const filteredAlbums = albums?.filter(album => album?.body !== 'Related');
  const options = [...filteredAlbums, { body: avatarOption }];

  const onSelectOption = opt => {
    if (opt === avatarOption) {
      setField(objectFields.avatar);
    } else {
      setField(objectFields.galleryItem);
      setSelectedAlbum(albums.find(al => al.body === opt));
    }
    setShowModal(true);
  };

  return (
    <div className="LightboxTools__container">
      <div className="ObjectCard">
        <div className="ObjectCard__top">
          {userName && (
            <div className="ObjectCard__links">
              <Link to={`/@${userName}`} title={userName}>
                <Avatar username={userName} size={34} lightbox />
              </Link>
              <Link
                to={`/@${userName}`}
                title={userName}
                className="LightboxTools__albumInfo-title  LightboxTools__name"
              >
                {userName}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div
        className={classNames({
          'LightboxTools__albumInfo-container': !isEmpty(albumName),
          'LightboxTools__albumInfo-related-container': !isEmpty(relatedWobjs),
        })}
      >
        {!isPost &&
          //   ? (
          //   <div className={'LightboxTools__search-container'}>
          //     <span className="LightboxTools__albumInfo-title">
          //       <FormattedMessage id="album" defaultMessage="Album" />:
          //     </span>
          //     <SearchObjectsAutocomplete className={'LightboxTools__search-objects'} />
          //   </div>
          // ) :
          getObjectName(wobject) &&
          albumName &&
          !isMobile() && (
            <>
              <span className="LightboxTools__albumInfo-title">
                <FormattedMessage id="album" defaultMessage="Album" />:
              </span>
              <Select
                defaultValue={albumName}
                value={albumName}
                onSelect={onSelectOption}
                className={'LightboxTools__select'}
                dropdownClassName={'LightboxTools__dropdown'}
              >
                {options
                  ?.filter(a => albumName !== a.body)
                  .map(al => (
                    <Select.Option key={al.body} label={al.body}>
                      {avatarOption === al.body ? al.body : `Add to album: ${al.body}`}{' '}
                    </Select.Option>
                  ))}
              </Select>
            </>
          )}
        {!isEmpty(relatedWobjs) && !isMobile() && isPost && (
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
};

LightboxHeader.propTypes = {
  userName: PropType.string,
  albumName: PropType.string,
  relatedPath: PropType.string,
  closeModal: PropType.func,
  setField: PropType.func,
  setShowModal: PropType.func,
  setSelectedAlbum: PropType.func,
  isPost: PropType.bool,
  relatedWobjs: PropType.arrayOf(),
  albums: PropType.arrayOf(),
  wobject: PropType.shape(),
};

LightboxHeader.defaultProps = {
  userName: '',
  albumName: '',
  relatedPath: '',
  isPost: false,
  relatedWobjs: [],
  albums: [],
  wobject: {},
  closeModal: () => {},
  setField: () => {},
  setShowModal: () => {},
  setSelectedAlbum: () => {},
};
export default LightboxHeader;
