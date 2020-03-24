import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import FollowButton from '../widgets/FollowButton';
import ObjectLightbox from '../components/ObjectLightbox';
import ObjectType from './ObjectType';
import Proposition from '../components/Proposition/Proposition';
import WeightTag from '../components/WeightTag';
import DEFAULTS from '../object/const/defaultValues';
import { accessTypesArr, haveAccess } from '../helpers/wObjectHelper';
import { getClientWObj } from '../adapters';
import { objectFields } from '../../common/constants/listOfFields';
import { AppSharedContext } from '../Wrapper';
import '../components/ObjectHeader.less';

const WobjHeader = ({
  isEditMode,
  wobject,
  username,
  intl,
  toggleViewEditMode,
  authenticated,
  isMobile,
}) => {
  const { usedLocale } = useContext(AppSharedContext);
  const coverImage = wobject.background || DEFAULTS.BACKGROUND;
  const style = { backgroundImage: `url("${coverImage}")` };
  const descriptionShort = wobject.title || '';
  const accessExtend = haveAccess(wobject, username, accessTypesArr[0]);
  const canEdit = accessExtend && isEditMode;
  const parentName = wobject.parent
    ? getClientWObj(wobject.parent, usedLocale)[objectFields.name]
    : '';
  const path =
    wobject.object_type === 'list' || wobject.object_type === 'page' ? wobject.object_type : '';
  const editLink = `/object/${wobject.author_permlink}/${isMobile ? 'about' : path}`;
  const getStatusLayout = statusField => (
    <div className="ObjectHeader__status-wrap">
      <span className="ObjectHeader__status-unavailable">{statusField.title}</span>&#32;
      {statusField.link && (
        <a href={statusField.link}>{<i className="iconfont icon-send PostModal__icon" />}</a>
      )}
    </div>
  );

  return (
    <div className="ObjectHeader ObjectHeader--cover" style={style}>
      <div className="ObjectHeader__container">
        <ObjectLightbox wobject={wobject} size={100} accessExtend={canEdit} />
        <div className="ObjectHeader__user">
          {parentName && (
            <Link
              to={`/object/${wobject.parent.author_permlink}`}
              title={`${intl.formatMessage({
                id: 'GoTo',
                defaultMessage: 'Go to',
              })} ${parentName}`}
              className="ObjectHeader__type"
            >
              {parentName}
            </Link>
          )}
          <div className="ObjectHeader__row">
            <div className="ObjectHeader__user__username">
              <div className="ObjectHeader__text" title={wobject.name}>
                {wobject.name}
              </div>
              <div className="ObjectHeader__controls">
                <FollowButton following={wobject.author_permlink || ''} followingType="wobject" />
                {accessExtend && authenticated && (
                  <Link to={editLink}>
                    <Button onClick={toggleViewEditMode}>
                      {isEditMode
                        ? intl.formatMessage({ id: 'view', defaultMessage: 'View' })
                        : intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="ObjectHeader__info">
            <Link to={`/discover-objects/${wobject.object_type}`}>
              <ObjectType type={wobject.object_type} />
            </Link>
            <WeightTag weight={wobject.weight} />
          </div>
          <div className="ObjectHeader__user__username">
            <div className="ObjectHeader__descriptionShort">
              {/* eslint-disable-next-line no-nested-ternary */}
              {canEdit && !descriptionShort ? (
                <Proposition
                  objectID={wobject.author_permlink}
                  fieldName={objectFields.title}
                  objName={wobject.name}
                />
              ) : wobject.status ? (
                getStatusLayout(wobject.status)
              ) : (
                descriptionShort
              )}
            </div>
          </div>
          {canEdit && !wobject[objectFields.background] && (
            <div className="ObjectHeader__user__addCover">
              <Proposition
                objectID={wobject.author_permlink}
                fieldName={objectFields.background}
                objName={wobject.name}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

WobjHeader.propTypes = {
  intl: PropTypes.shape(),
  isEditMode: PropTypes.bool,
  authenticated: PropTypes.bool,
  wobject: PropTypes.shape(),
  username: PropTypes.string,
  toggleViewEditMode: PropTypes.func,
  isMobile: PropTypes.bool,
};

WobjHeader.defaultProps = {
  intl: {},
  isEditMode: false,
  authenticated: false,
  wobject: {},
  username: '',
  toggleViewEditMode: () => {},
  isMobile: false,
};

const mapStateToProps = state => ({ isMobile: state.app.screenSize !== 'large' });

export default injectIntl(connect(mapStateToProps)(WobjHeader));
