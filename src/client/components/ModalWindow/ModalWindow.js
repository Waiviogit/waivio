import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import { getModalVisability } from '../../reducers';
import { setModalVisibility } from './modalActions';

@connect(
  state => ({
    visibility: getModalVisability(state),
  }),
  { setModalVisability: setModalVisibility },
)
class ModalWindow extends React.Component {
  static propTypes = {
    /* from connect */
    visibility: PropTypes.bool,
    setModalVisability: PropTypes.func.isRequired,
    /* passed props */
    title: PropTypes.string,
    content: PropTypes.shape.isRequired,
    onConfirm: PropTypes.shape,
    onDisconfirm: PropTypes.shape,
  };
  static defaultProps = {
    visibility: false,
    title: '',
    onConfirm: () => {},
    onDisconfirm: () => {},
  };

  handleOk = (e, onConfirm) => {
    if (onConfirm) {
      onConfirm();
    }
    this.props.setModalVisability();
  };

  handleCancel = (e, onDisconfirm) => {
    if (onDisconfirm) {
      onDisconfirm();
    }
    this.props.setModalVisability();
  };

  render() {
    const { content, onConfirm, onDisconfirm, visibility, title } = this.props;
    return (
      <Modal
        closable
        title={title || null}
        maskClosable={false}
        visible={visibility}
        onOk={e => {
          this.handleOk(e, onConfirm);
        }}
        onCancel={e => {
          this.handleCancel(e, onDisconfirm);
        }}
      >
        {content}
      </Modal>
    );
  }
}

export default ModalWindow;
