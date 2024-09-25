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
import AffiliateEditModal from './AffiliateEditModal';

const AffiliateCodesList = ({
  affiliateObjects,
  rejectCode,
  user,
  context,
  setFieldsValue,
  onSubmit,
  validateFieldsAndScroll,
  setSelectedObj,
  wobjName,
}) => {
  const [visibleEditModal, setVisibleEditModal] = React.useState(false);
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

  const openEditModal = obj => {
    setVisibleEditModal(true);
    setSelectedObj(obj);
  };

  const editCode = (obj, value) => {
    deleteCode(obj);
    onSubmit(value);
    setVisibleEditModal(false);
  };

  return (
    <div className={codesClassList}>
      {emptyCodes ? (
        <FormattedMessage id={'aff_codes_empty'} defaultMessage={'No affiliate codes added.'} />
      ) : (
        // eslint-disable-next-line array-callback-return,consistent-return
        affiliateObjects?.map(obj => {
          const handleEditCode = value => {
            editCode(obj, value);
          };

          if (obj.affiliateCode) {
            const affiliateCode = JSON.parse(obj.affiliateCode);
            let codes = [affiliateCode[1]];

            if (affiliateCode.length > 2) {
              affiliateCode.shift();

              codes = [...affiliateCode];
            }

            return (
              <div key={obj._id} className="AffiliateCodes__object">
                <Link to={`/object/${obj.author_permlink}`} className="AffiliateCodes__object-info">
                  <ObjectAvatar size={50} item={obj} />
                  <div className="AffiliateCodes__object-info-text">
                    <Link to={`/object/${obj.author_permlink}`}>{obj.name}</Link>
                    {codes?.map(item => {
                      const parseCode = item.split('::');

                      return (
                        <div key={item} className="AffiliateCodes__aff-code">
                          {parseCode[0]}
                          {parseCode[1] ? ` - ${parseCode[1]}%` : ''}
                        </div>
                      );
                    })}
                  </div>
                </Link>
                {codes?.length > 1 ? (
                  <Button type="primary" onClick={() => openEditModal(obj)}>
                    <FormattedMessage id="edit" defaultMessage="Edit" />
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => deleteCode(obj)}>
                    <FormattedMessage id="delete" defaultMessage="Delete" />
                  </Button>
                )}
                {visibleEditModal && (
                  <AffiliateEditModal
                    affiliateCode={affiliateCode}
                    validateFieldsAndScroll={validateFieldsAndScroll}
                    visibleEditModal={visibleEditModal}
                    setFieldsValue={setFieldsValue}
                    onClose={() => setVisibleEditModal(false)}
                    editCode={handleEditCode}
                    affName={wobjName}
                  />
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
  setFieldsValue: PropTypes.func,
  onSubmit: PropTypes.func,
  validateFieldsAndScroll: PropTypes.func,
  setSelectedObj: PropTypes.func,
  wobjName: PropTypes.string,
};

export default AffiliateCodesList;
