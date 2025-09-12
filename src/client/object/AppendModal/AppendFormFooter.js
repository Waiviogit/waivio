import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form } from 'antd';
import { FormattedMessage } from 'react-intl';

import LikeSection from '../LikeSection';
import FollowObjectForm from '../FollowObjectForm';
import { getFollowingObjectsList } from '../../../store/userStore/userSelectors';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';

const AppendFormFooter = ({ loading, form, handleSubmit, calcVote, selectWobj, disabled }) => {
  const [littleVotePower, setLittleVotePower] = useState();
  const followingList = useSelector(getFollowingObjectsList);
  const wObject = useSelector(getObject);
  const { getFieldValue } = form;
  const calculateVoteWorth = (percent, worth) => {
    calcVote(percent, worth);
  };

  return (
    <React.Fragment>
      <LikeSection
        onVotePercentChange={calculateVoteWorth}
        form={form}
        showSlider
        disabled={loading}
        selectedType={selectWobj}
        setLittleVotePower={setLittleVotePower}
      />
      {followingList?.includes(wObject.author_permlink) ? null : (
        <FollowObjectForm loading={loading} form={form} />
      )}

      {getFieldValue('currentField') !== 'auto' && (
        <Form.Item className="AppendForm__bottom__submit">
          <Button
            className="AppendForm__submit"
            type="primary"
            loading={loading}
            disabled={littleVotePower || !form.getFieldValue('like') || loading || disabled}
            onClick={handleSubmit}
          >
            <FormattedMessage
              id={loading ? 'post_send_progress' : 'append_send'}
              defaultMessage={loading ? 'Submitting' : 'Suggest'}
            />
          </Button>
        </Form.Item>
      )}
    </React.Fragment>
  );
};

AppendFormFooter.propTypes = {
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  form: PropTypes.shape().isRequired,
  selectWobj: PropTypes.shape().isRequired,
  handleSubmit: PropTypes.func.isRequired,
  calcVote: PropTypes.func.isRequired,
};

export default AppendFormFooter;
