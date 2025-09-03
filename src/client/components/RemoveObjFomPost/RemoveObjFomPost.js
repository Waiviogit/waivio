import { isEmpty } from 'lodash';
import React from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getObjectName, prepareRemoveData } from '../../../common/helpers/wObjectHelper';
import { rejectAuthorReview } from '../../../store/newRewards/newRewardsActions';
import { appendObject } from '../../../store/appendStore/appendActions';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getCampaignType } from '../../rewards/rewardsHelper';

import './RemoveObjFomPost.less';

const RemoveObjFomPost = ({ visible, linkedObj, onClose, campaigns, post }) => {
  const [rejectedList, setRejectedList] = React.useState([]);
  const dispatch = useDispatch();
  const currUser = useSelector(getAuthenticatedUserName);
  const rejectCampaigns = camp => {
    const campType = getCampaignType(camp.type);

    Modal.confirm({
      title: `Reject ${campType}`,
      content: `Do you want to reject this ${campType}?`,
      onOk() {
        return new Promise(resolve => {
          dispatch(rejectAuthorReview({ ...post, ...camp }))
            .then(() => {
              resolve();
              setRejectedList([...rejectedList, camp.campaignId]);
            })
            .catch(() => {
              resolve();
            });
        });
      },
    });
  };

  const deletePostFromObj = obj =>
    Modal.confirm({
      title: `Remove`,
      content: `Remove this post from ${getObjectName(obj)}?`,
      onOk() {
        return new Promise(resolve => {
          dispatch(appendObject(prepareRemoveData(post, currUser, obj), { isLike: true }))
            .then(() => {
              resolve();
              setRejectedList([...rejectedList, obj.author_permlink]);
            })
            .catch(() => {
              resolve();
            });
        });
      },
    });

  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <div className={'RemoveObjFomPost'}>
        <h4>Reject post created for campaigns:</h4>
        {campaigns.map(camp => (
          <div key={camp.campaignId || camp._id} className={'RemoveObjFomPost__item'}>
            <span>{camp.name}</span>

            {rejectedList.includes(camp.campaignId) ? (
              <span>rejected</span>
            ) : (
              <Button onClick={() => rejectCampaigns(camp)} type="primary">
                reject
              </Button>
            )}
          </div>
        ))}
        {!isEmpty(linkedObj) && (
          <React.Fragment>
            <h4>Remove the post from objects:</h4>
            {linkedObj.map(obj => (
              <div key={getObjectName(obj)} className={'RemoveObjFomPost__item'}>
                <span>
                  {obj.object_type === 'hashtag' ? '#' : ''}
                  {getObjectName(obj)}
                </span>

                {rejectedList.includes(obj?.author_permlink) ? (
                  <span>removed</span>
                ) : (
                  <Button type="primary" onClick={() => deletePostFromObj(obj)}>
                    remove
                  </Button>
                )}
              </div>
            ))}
          </React.Fragment>
        )}
      </div>
    </Modal>
  );
};

RemoveObjFomPost.propTypes = {
  visible: PropTypes.bool,
  linkedObj: PropTypes.arrayOf(PropTypes.shape({})),
  onClose: PropTypes.func,
  campaigns: PropTypes.arrayOf(PropTypes.shape({})),
  post: PropTypes.shape({}),
};

export default RemoveObjFomPost;
