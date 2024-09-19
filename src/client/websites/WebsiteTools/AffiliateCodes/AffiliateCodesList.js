import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import classNames from 'classnames';
import { has } from 'lodash';
import ObjectAvatar from '../../../components/ObjectAvatar';
import { isGuestUser } from '../../../../store/authStore/authSelectors';

const AffiliateCodesList = ({ affiliateObjects, rejectCode, user, context, setOpenAppendModal }) => {
  const isGuest = useSelector(isGuestUser);
  const emptyCodes = affiliateObjects?.every(obj => !has(obj, 'affiliateCode'));
  const codesClassList = classNames('AffiliateCodes__object-table', {
    'AffiliateCodes__table-empty': emptyCodes,
  });
  const deleteCode = obj => {
    // eslint-disable-next-line array-callback-return,consistent-return
    const currUpdate = obj.affiliateCodeFields.find(update => {
      if (update.name === 'affiliateCode') {
        const AffCode = JSON.parse(update?.body)[1];

        return AffCode === JSON.parse(obj?.affiliateCode)[1];
      }
    });

    rejectCode(
      currUpdate.author,
      obj.author_permlink,
      currUpdate.permlink,
      isGuest ? 9999 : 1,
      user.name,
      context,
    );
  };

  const editCode = obj => {
    setOpenAppendModal();
  };

  return (
    <div className={codesClassList}>
      {emptyCodes ? (
        <FormattedMessage id={'aff_codes_empty'} defaultMessage={'No affiliate codes added.'} />
      ) : (
        // eslint-disable-next-line array-callback-return,consistent-return
        affiliateObjects?.map(obj => {
          if (obj.affiliateCode) {
            const affiliateCode = JSON.parse(obj.affiliateCode);
            let codes = [affiliateCode[1]];

            if (affiliateCode.length > 2) {
              affiliateCode.shift();
              codes = affiliateCode.map(code => {
                const c = code.split('::');

                return c[0];
              });
            }

            return (
              <div key={obj._id} className="AffiliateCodes__object">
                <Link to={`/object/${obj.author_permlink}`} className="AffiliateCodes__object-info">
                  <ObjectAvatar size={50} item={obj} />
                  <div className="AffiliateCodes__object-info-text">
                    <Link to={`/object/${obj.author_permlink}`}>{obj.name}</Link>
                    {codes?.map(item => (
                      <div key={item} className="AffiliateCodes__aff-code">
                        {item}
                      </div>
                    ))}
                  </div>
                </Link>
                {codes?.length > 1 ? (
                  <Button type="primary" onClick={() => editCode(obj)}>
                    <FormattedMessage id="edit" defaultMessage="Edit" />
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => deleteCode(obj)}>
                    <FormattedMessage id="delete" defaultMessage="Delete" />
                  </Button>
                )}
              </div>
            );
          }
        })
      )}
    </div>
  );
};

AffiliateCodesList.propTypes = {
  affiliateObjects: PropTypes.arrayOf(),
  user: PropTypes.shape(),
  rejectCode: PropTypes.func,
  context: PropTypes.string,
};

export default AffiliateCodesList;
