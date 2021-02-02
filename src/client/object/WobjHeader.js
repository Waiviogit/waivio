import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'lodash';

import FollowButton from '../widgets/FollowButton';
import ObjectLightbox from '../components/ObjectLightbox';
import ObjectType from './ObjectType';
import Proposition from '../components/Proposition/Proposition';
import WeightTag from '../components/WeightTag';
import BellButton from '../widgets/BellButton';
import DEFAULTS from '../object/const/defaultValues';
import { objectFields } from '../../common/constants/listOfFields';
import {
  accessTypesArr,
  haveAccess,
  getObjectName,
  parseWobjectField,
} from '../helpers/wObjectHelper';
import { followWobject, unfollowWobject } from './wobjActions';

import '../components/ObjectHeader.less';
import { getIsWaivio } from '../reducers';

const WobjHeader = ({
  isEditMode,
  wobject,
  username,
  intl,
  toggleViewEditMode,
  authenticated,
  followWobj,
  unfollowWobj,
  isWaivio,
}) => {
  const coverImage = wobject.background || DEFAULTS.BACKGROUND;
  const style = { backgroundImage: `url("${coverImage}")` };
  const descriptionShort = wobject.title || '';
  const accessExtend = haveAccess(wobject, username, accessTypesArr[0]);
  const canEdit = accessExtend && isEditMode;
  const parent = get(wobject, 'parent', {});
  const parentName = getObjectName(parent);
  const status = parseWobjectField(wobject, 'status');
  const name = getObjectName(wobject);
  const isHashtag = wobject.object_type === 'hashtag';

  const getStatusLayout = statusField => (
    <div className="ObjectHeader__status-wrap">
      <span className="ObjectHeader__status-unavailable">{statusField.title}</span>&#32;
      {statusField.link && (
        <a href={statusField.link}>{<i className="iconfont icon-send PostModal__icon" />}</a>
      )}
    </div>
  );

  const statusFields = status ? getStatusLayout(status) : descriptionShort;

  return (
    <div className="ObjectHeader ObjectHeader--cover" style={style}>
      <div className="ObjectHeader__container">
        <ObjectLightbox wobject={wobject} size={100} accessExtend={canEdit} />
        <div className="ObjectHeader__user">
          {parentName && (
            <Link
              to={parent.defaultShowLink}
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
              <div className="ObjectHeader__text" title={name}>
                {name}
              </div>
              <div className="ObjectHeader__controls">
                <FollowButton
                  followObject={followWobj}
                  unfollowObject={unfollowWobj}
                  following={wobject.youFollows}
                  wobj={wobject}
                  followingType="wobject"
                />
                {accessExtend && authenticated && isWaivio && (
                  <React.Fragment>
                    <Button onClick={toggleViewEditMode}>
                      {isEditMode
                        ? intl.formatMessage({ id: 'view', defaultMessage: 'View' })
                        : intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
                    </Button>
                    {wobject.youFollows && <BellButton wobj={wobject} />}
                  </React.Fragment>
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
              {!isHashtag && canEdit && !descriptionShort ? (
                <Proposition
                  objectID={wobject.author_permlink}
                  fieldName={objectFields.title}
                  objName={name}
                />
              ) : (
                statusFields
              )}
            </div>
          </div>
          {canEdit && !wobject[objectFields.background] && !isHashtag && (
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
  followWobj: PropTypes.func,
  unfollowWobj: PropTypes.func,
  isWaivio: PropTypes.bool,
};

WobjHeader.defaultProps = {
  intl: {},
  isEditMode: false,
  authenticated: false,
  wobject: {},
  username: '',
  toggleViewEditMode: () => {},
  isMobile: false,
  isWaivio: true,
  followWobj: () => {},
  unfollowWobj: () => {},
};

const mapStateToProps = state => ({
  isMobile: state.app.screenSize !== 'large',
  isWaivio: getIsWaivio(state),
});

export default injectIntl(
  connect(mapStateToProps, {
    followWobj: followWobject,
    unfollowWobj: unfollowWobject,
  })(WobjHeader),
);
