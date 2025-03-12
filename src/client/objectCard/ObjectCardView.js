import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { truncate, get, isEmpty, uniq, round } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Icon } from 'antd';

import RatingsWrap from './RatingsWrap/RatingsWrap';
import DEFAULTS from '../object/const/defaultValues';
import {
  getObjectName,
  parseAddress,
  getObjectAvatar,
  hasType,
} from '../../common/helpers/wObjectHelper';
import { getProxyImageURL } from '../../common/helpers/image';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';
import USDDisplay from '../components/Utils/USDDisplay';
import { defaultCurrency } from '../websites/constants/currencyTypes';
import AffiliatLink from '../widgets/AffiliatLinks/AffiliatLink';
import HeartButton from '../widgets/HeartButton';

import './ObjectCardView.less';
import { getTagName } from '../../common/helpers/tagsNamesList';
import { getIsSocial, getWebsiteConfiguration } from '../../store/appStore/appSelectors';

const ObjectCardView = ({
  intl,
  wObject,
  path,
  passedParent,
  hovered,
  withRewards,
  rewardPrice,
  isReserved,
  closeButton,
  onDelete,
  isPost,
  postAuthor,
  showHeart,
  payoutToken,
  rate,
  handleReportClick,
  isRejected,
  socialMap,
}) => {
  const username = useSelector(getAuthenticatedUserName);
  const config = useSelector(getWebsiteConfiguration);
  const [tags, setTags] = useState([]);
  const [rejected, setRejected] = useState(isRejected);
  const [rejectedLoading, setRejectedLoading] = useState(isRejected);
  const address = parseAddress(wObject, ['postalCode', 'country']);
  const parent = isEmpty(passedParent) ? get(wObject, 'parent', {}) : passedParent;
  const parentLink = get(parent, 'defaultShowLink');
  const objName = getObjectName(wObject);
  const parentName = getObjectName(parent);
  const isSocial = useSelector(getIsSocial);
  const prise = withRewards ? null : wObject.price;
  const isUser = wObject.object_type === 'user';
  const objectCardClassList = classNames('ObjectCardView', {
    'ObjectCardView--hovered': hovered,
  });
  const baseObjPermlink = config?.shopSettings?.value;

  let pathName =
    isSocial &&
    [wObject.author_permlink, wObject?.parent?.author_permlink]?.includes(baseObjPermlink)
      ? '/'
      : wObject.defaultShowLink || `/object/${wObject.author_permlink}`;

  pathName = hasType(wObject, 'page') && path ? path : pathName;

  if (isUser) {
    pathName = `/@${objName}`;
  }

  useEffect(() => {
    const objectTags = get(wObject, 'topTags', []);

    setTags(socialMap ? objectTags : uniq([wObject.object_type, ...objectTags]));
  }, [wObject.author_permlink]);

  const avatarLayout = () => {
    let url = getObjectAvatar(wObject) || getObjectAvatar(parent);

    if (url) url = getProxyImageURL(url, 'preview');
    else url = DEFAULTS.AVATAR;

    return (
      <div
        className="avatar-image"
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    );
  };

  const description = wObject.description && (
    <div
      className="ObjectCardView__title"
      title={truncate(wObject.description, {
        length: 250,
        separator: ' ',
      })}
    >
      {truncate(wObject.description, {
        length: socialMap ? 70 : 140,
        separator: ' ',
      })}
    </div>
  );
  const goToObjTitle = wobjName =>
    `${intl.formatMessage({
      id: 'GoTo',
      defaultMessage: 'Go to',
    })} ${wobjName}`;

  return (
    <div className={objectCardClassList} key={wObject.author_permlink}>
      <div className="ObjectCardView__content">
        <div className="ObjectCardView__content-row">
          <Link
            to={pathName}
            title={goToObjTitle(objName)}
            className="ObjectCardView__avatar"
            key={wObject.author_permlink}
          >
            {avatarLayout()}
          </Link>
          <div className={socialMap ? 'ObjectCardView__social-info' : 'ObjectCardView__info'}>
            {parentName && (
              <Link
                to={parentLink}
                title={goToObjTitle(parentName)}
                className="ObjectCardView__type"
              >
                {parentName}
              </Link>
            )}
            <div className="ObjectCardView__name">
              <Link
                key={wObject.author_permlink}
                to={pathName}
                className="ObjectCardView__name-truncated"
                title={goToObjTitle(objName)}
              >
                {objName}
              </Link>
              {handleReportClick &&
                username &&
                (rejectedLoading ? (
                  <Icon type="loading" />
                ) : (
                  <span
                    className={classNames({
                      CategoryItemView__reject: !rejected,
                      CategoryItemView__rejected: rejected,
                    })}
                    onClick={() => {
                      setRejectedLoading(true);
                      if (!rejected)
                        handleReportClick(wObject.author_permlink).then(() => {
                          setRejected(true);
                          setRejectedLoading(false);
                        });
                    }}
                  >
                    ({rejected ? 'rejected' : 'reject'})
                  </span>
                ))}
              {/* {!isNaN(wObject.weight) && <WeightTag weight={Number(wObject.weight)} />} */}
            </div>
            {wObject.rating && (
              <RatingsWrap
                socialMap={socialMap}
                ratings={wObject.rating}
                username={isPost ? postAuthor : username}
                wobjId={wObject.id || wObject.author_permlink}
                wobjName={objName}
              />
            )}
            <span className="ObjectCardView__tag-text">
              {prise && (
                <span className="ObjectCardView__price" title={prise}>
                  {prise}
                </span>
              )}
              {tags.map((tag, index) => {
                const formattedMessage = intl.formatMessage({
                  id: `object_type_${tag}`,
                  defaultMessage: getTagName(tag),
                });
                const displayMessage = getTagName(formattedMessage);

                return (
                  <span key={tag}>
                    {index === 0 && !prise ? (
                      displayMessage
                    ) : (
                      <span>
                        &nbsp;&middot;
                        {`  ${displayMessage}`}
                      </span>
                    )}
                  </span>
                );
              })}
            </span>
            {address && (
              <div className="ObjectCardView__tag-text">
                {socialMap
                  ? truncate(address, {
                      length: 33,
                      separator: ' ',
                    })
                  : address}
              </div>
            )}
            {wObject.title ? (
              <div
                className="ObjectCardView__title"
                title={truncate(wObject.title, {
                  length: 250,
                  separator: ' ',
                })}
              >
                {truncate(wObject.title, {
                  length: socialMap ? 70 : 140,
                  separator: ' ',
                })}
              </div>
            ) : (
              description
            )}
            {!isEmpty(wObject.affiliateLinks) &&
              !isEmpty(
                wObject.affiliateLinks.filter(i => i.type.toLocaleLowerCase() !== 'instacart'),
              ) && (
                <div className="ObjectCardView__affiliatLinksWrap">
                  <span className="ObjectCardView__buyOn">
                    {intl.formatMessage({ id: 'buy_it_on', defaultMessage: 'Buy it on' })}:
                  </span>
                  <div className="ObjectCardView__affiliatLinks">
                    {wObject.affiliateLinks.map(link => (
                      <AffiliatLink key={link.link} link={link} />
                    ))}
                  </div>
                </div>
              )}
          </div>
          {username && showHeart && !isUser && (
            <div className="avatar-heart">
              <HeartButton wobject={wObject} size={'20px'} />
            </div>
          )}
        </div>
        {withRewards && (
          <div className="ObjectCardView__rewardsInfo">
            {Boolean(wObject.price) && (
              <span title={wObject.price} className="ObjectCardView__rewardsPrice">
                {intl.formatMessage({ id: 'price', defaultMessage: 'PRICE' })}: {wObject.price} |{' '}
              </span>
            )}
            <span className="ObjectCardView__earnWrap">
              <b>
                {intl.formatMessage({
                  id: 'you_earn',
                  defaultMessage: 'YOU EARN',
                })}
                :
              </b>{' '}
              {isReserved ? (
                <React.Fragment>
                  <b className="ObjectCardView__priceColor">{round(rewardPrice / rate, 3)}</b>{' '}
                  {payoutToken || 'HIVE'}
                </React.Fragment>
              ) : (
                <USDDisplay
                  value={rewardPrice}
                  currencyDisplay="symbol"
                  style={{ fontWeight: 'bolder' }}
                />
              )}
            </span>
          </div>
        )}
      </div>
      {closeButton && (
        <span role="presentation" onClick={onDelete} className="iconfont icon-delete" />
      )}
    </div>
  );
};

ObjectCardView.propTypes = {
  intl: PropTypes.shape().isRequired,
  wObject: PropTypes.shape(),
  passedParent: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  path: PropTypes.string,
  payoutToken: PropTypes.string,
  hovered: PropTypes.bool,
  withRewards: PropTypes.bool,
  isReserved: PropTypes.bool,
  rewardPrice: PropTypes.number,
  rate: PropTypes.number,
  options: PropTypes.shape({
    pathNameAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  }),
  closeButton: PropTypes.bool,
  isPost: PropTypes.bool,
  showHeart: PropTypes.bool,
  isRejected: PropTypes.bool,
  socialMap: PropTypes.bool,
  postAuthor: PropTypes.string,
  onDelete: PropTypes.func,
  handleReportClick: PropTypes.func,
};

ObjectCardView.defaultProps = {
  options: {},
  wObject: {},
  path: '',
  postAuthor: '',
  payoutToken: '',
  passedParent: {},
  withRewards: false,
  socialMap: false,
  showHeart: true,
  isReserved: false,
  isPost: false,
  rewardPrice: 0,
  currency: defaultCurrency,
  hovered: false,
  handleReportClick: null,
  closeButton: false,
  onDelete: null,
};
export default injectIntl(ObjectCardView);
