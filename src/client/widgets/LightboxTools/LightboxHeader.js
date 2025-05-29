import React, { useEffect } from 'react';
import { Select } from 'antd';
import { isEmpty } from 'lodash';
import * as PropType from 'prop-types';
import { Link } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Avatar from '../../components/Avatar';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { objectFields } from '../../../common/constants/listOfFields';
import { getObjectAlbums, getRelatedPhotos } from '../../../store/galleryStore/gallerySelectors';
import { getAlbums } from '../../../store/galleryStore/galleryActions';
import './LightboxTools.less';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';

const LightboxHeader = ({
  userName,
  albums,
  setField,
  setShowModal,
  setSelectedAlbum,
  objs,
  obj,
  setObj,
  currentSrc,
  isPost,
  relatedAlbum = {},
}) => {
  const isAuth = useSelector(getIsAuthenticated);
  const avatarOption = 'Set as avatar picture';
  const options = isEmpty(relatedAlbum)
    ? [...albums, { body: avatarOption }]
    : [...albums, relatedAlbum, { body: avatarOption }];

  const dispatch = useDispatch();

  const albumName = [...albums, relatedAlbum].reduce((result, album) => {
    if (result) return result;
    const match = album.items?.find(item => item.body === currentSrc);

    return match ? album.body : null;
  }, null);

  const onSelectOption = opt => {
    if (opt === avatarOption) {
      setField(objectFields.avatar);
    } else {
      setField(objectFields.galleryItem);
      setSelectedAlbum(albums.find(al => al.body === opt));
    }
    setShowModal(true);
  };

  useEffect(() => {
    dispatch(getAlbums(obj?.author_permlink));
  }, [obj?.author_permlink]);

  return (
    <div className="LightboxTools__container-header">
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
      {isAuth && (
        <div className={'LightboxTools__selects'}>
          {!isEmpty(objs) && !isMobile() && (
            <div>
              <span className="LightboxTools__albumInfo-title">
                <FormattedMessage id="related_object" defaultMessage="Related object" />:
              </span>
              <Select
                defaultValue={objs[0]?.author_permlink}
                value={obj?.author_permlink}
                onChange={permlink => {
                  const selectedObj = objs.find(w => w.author_permlink === permlink);

                  if (selectedObj) setObj(selectedObj);
                }}
                className="LightboxTools__select"
                dropdownClassName="LightboxTools__dropdown"
              >
                {objs.map(w => (
                  <Select.Option key={w.author_permlink} value={w.author_permlink}>
                    {w.name || w.default_name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
          {!isMobile() && !isEmpty(objs) && (
            <div>
              <span className="LightboxTools__albumInfo-title">
                <FormattedMessage id="album" defaultMessage="Album" />:
              </span>
              <Select
                defaultValue={isPost ? 'Related' : albumName}
                onSelect={onSelectOption}
                className={'LightboxTools__select'}
                dropdownClassName={'LightboxTools__dropdown'}
              >
                {options.map(al => (
                  <Select.Option key={al.body} value={al.body}>
                    {avatarOption === al.body || albumName === al.body
                      ? al.body
                      : `Add to album: ${al.body}`}{' '}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

LightboxHeader.propTypes = {
  userName: PropType.string,
  currentSrc: PropType.string,
  setField: PropType.func,
  setShowModal: PropType.func,
  setObj: PropType.func,
  setSelectedAlbum: PropType.func,
  objs: PropType.arrayOf(),
  albums: PropType.arrayOf(),
  obj: PropType.shape(),
  relatedAlbum: PropType.shape(),
  isPost: PropType.bool,
};

LightboxHeader.defaultProps = {
  userName: '',
  isPost: false,
  relatedWobjs: [],
  albums: [],
  wobject: {},
  closeModal: () => {},
  setField: () => {},
  setShowModal: () => {},
  setSelectedAlbum: () => {},
};
const mapStateToProps = state => ({
  albums: getObjectAlbums(state),
  relatedAlbum: getRelatedPhotos(state),
});

export default connect(mapStateToProps)(LightboxHeader);
