import { Modal, Slider } from 'antd';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const marks = {
  1: '1%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};

const ChangeVotingModal = ({
  isLoading,
  handleOpenVoteModal,
  handleSetMinVotingPower,
  title,
  visible,
  minVotingPower,
}) => {
  const [sliderValue, setSliderValue] = useState(100);
  const formatTooltip = value => `${value}%`;
  const handleChangeSliderValue = value => setSliderValue(value);

  return (
    <Modal
      confirmLoading={isLoading}
      onCancel={handleOpenVoteModal}
      onOk={() => handleSetMinVotingPower(sliderValue)}
      title={title}
      visible={visible}
    >
      <Slider
        defaultValue={minVotingPower}
        onChange={handleChangeSliderValue}
        min={1}
        marks={marks}
        tipFormatter={formatTooltip}
      />
    </Modal>
  );
};

ChangeVotingModal.propTypes = {
  isLoading: PropTypes.bool,
  handleOpenVoteModal: PropTypes.func,
  handleSetMinVotingPower: PropTypes.func,
  title: PropTypes.string,
  visible: PropTypes.bool,
  minVotingPower: PropTypes.number,
};

export default ChangeVotingModal;
