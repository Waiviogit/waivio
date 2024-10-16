import React from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getObjectName, prepareRemoveData } from '../../../common/helpers/wObjectHelper';
import { rejectAuthorReview } from '../../../store/newRewards/newRewardsActions';
import { appendObject } from '../../../store/appendStore/appendActions';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import './RemoveObjFomPost.less';

const RemoveObjFomPost = ({ visible, linkedObj, onClose, campaigns, post }) => {
  const [rejectedList, setRejectedList] = React.useState([]);
  const dispatch = useDispatch();
  const currUser = useSelector(getAuthenticatedUserName);
  const rejectCampaigns = camp =>
    Modal.confirm({
      title: `Reject ${camp.type}`,
      content: `Do you want to reject this ${camp.type}?`,
      onOk() {
        return new Promise(resolve => {
          dispatch(rejectAuthorReview({ ...post, type: camp.type }))
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

  const deletePostFromObj = obj =>
    Modal.confirm({
      title: `Delete this post from object`,
      content: `Delete this post from object ${getObjectName(obj)}?`,
      onOk() {
        return new Promise(resolve => {
          dispatch(appendObject(prepareRemoveData(post, currUser, obj)))
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
        <h4>Reject review or mentions created for campaigns:</h4>
        {campaigns.map(camp => (
          <div key={camp.campaignId} className={'RemoveObjFomPost__item'}>
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
        <h4>Remove the post from objects:</h4>
        {linkedObj.map(obj => (
          <div key={getObjectName(obj)} className={'RemoveObjFomPost__item'}>
            <span>{getObjectName(obj)}</span>

            {rejectedList.includes(obj.author_permlink) ? (
              <span>deleted</span>
            ) : (
              <Button type="primary" onClick={() => deletePostFromObj(obj)}>
                delete
              </Button>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

RemoveObjFomPost.propTypes = {
  visible: PropTypes.bool,
  linkedObj: PropTypes.bool,
  onClose: PropTypes.bool,
  campaigns: PropTypes.bool,
  post: PropTypes.bool,
};

export default RemoveObjFomPost;
