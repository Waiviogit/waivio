import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import ObjectLightbox from '../components/ObjectLightbox';
import FollowButton from '../widgets/FollowButton';
import { haveAccess, accessTypesArr } from '../helpers/wObjectHelper';
import {
  getFieldWithMaxWeight,
  getInnerFieldWithMaxWeight,
} from '../../client/object/wObjectHelper';
import { objectFields as objectTypes, objectFields } from '../../common/constants/listOfFields';
import Proposition from '../components/Proposition/Proposition';
import ObjectType from './ObjectType';
import '../components/ObjectHeader.less';
import WeightTag from '../components/WeightTag';

const WobjHeader = ({ isEditMode, wobject, username, intl, toggleViewEditMode, authenticated }) => {
  const coverImage = getFieldWithMaxWeight(
    wobject,
    objectFields.background,
    objectFields.background,
  );
  const hasCover = !!coverImage;
  const style = hasCover
    ? { backgroundImage: `url("https://steemitimages.com/2048x512/${coverImage}")` }
    : {};
  const descriptionShort = getFieldWithMaxWeight(wobject, objectFields.title);
  const status = getInnerFieldWithMaxWeight(wobject, objectFields.status);
  const accessExtend = haveAccess(wobject, username, accessTypesArr[0]);
  const objectName = getFieldWithMaxWeight(wobject, objectFields.name) || wobject.default_name;
  const canEdit = accessExtend && isEditMode;
  const parentName = wobject.parent ? getFieldWithMaxWeight(wobject.parent, objectTypes.name) : '';

  const getStatusLayout = stat => (
    <div className="ObjectHeader__status-wrap">
      <span className="ObjectHeader__status-unavailable">{status.title}</span>&#32;
      {stat.link && <a href={stat.link}>{<i className="iconfont icon-send PostModal__icon" />}</a>}
    </div>
  );

  return (
    <div className={classNames('ObjectHeader', { 'ObjectHeader--cover': hasCover })} style={style}>
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
              <div className="ObjectHeader__text" title={objectName}>
                {objectName}
              </div>
              <div className="ObjectHeader__controls">
                <FollowButton following={wobject.author_permlink} followingType="wobject" />
                {accessExtend && authenticated && (
                  <Button onClick={toggleViewEditMode}>
                    {isEditMode
                      ? intl.formatMessage({ id: 'view', defaultMessage: 'View' })
                      : intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="ObjectHeader__info">
            <ObjectType type={wobject.object_type} />
            <WeightTag weight={wobject.weight} rank={wobject.rank} />
          </div>
          <div className="ObjectHeader__user__username">
            <div className="ObjectHeader__descriptionShort">
              {/* eslint-disable-next-line no-nested-ternary */}
              {canEdit && !descriptionShort ? (
                <Proposition
                  objectID={wobject.author_permlink}
                  fieldName={objectFields.title}
                  objName={objectName}
                />
              ) : status ? (
                getStatusLayout(status)
              ) : (
                descriptionShort
              )}
            </div>
          </div>
          {canEdit && !hasCover && (
            <div className="ObjectHeader__user__addCover">
              <Proposition
                objectID={wobject.author_permlink}
                fieldName={objectFields.background}
                objName={objectName}
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
};

WobjHeader.defaultProps = {
  intl: {},
  isEditMode: false,
  authenticated: false,
  wobject: {},
  username: '',
  toggleViewEditMode: () => {},
};

export default injectIntl(WobjHeader);
