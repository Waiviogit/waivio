import { Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { initialColors } from '../../../constants/colors';

const SelectColorModal = props => {
  const [markerColor, setMarkerColor] = useState('');
  const [textColor, setTextColor] = useState('');

  useEffect(() => {
    setMarkerColor(props.colors.mapMarkerBody || initialColors.marker);
    setTextColor(props.colors.mapMarkerText || initialColors.text);
  }, []);

  const handleChangeMarkerColor = useCallback(
    debounce(color => setMarkerColor(color), 300),
    [],
  );
  const handleChangeTextColor = useCallback(
    debounce(color => setTextColor(color), 300),
    [],
  );
  const handleCancelModal = () => {
    props.setOpenColorsModal(false);
    setMarkerColor('');
    setTextColor('');
  };
  const handleOkModal = () =>
    props.handleSubmitColors({
      mapMarkerBody: markerColor,
      mapMarkerText: textColor,
    });

  return (
    <Modal
      wrapClassName={'mapModalClassList'}
      title={props.intl.formatMessage({
        id: 'website_colors',
        defaultMessage: 'Website colors',
      })}
      closable
      onCancel={handleCancelModal}
      onOk={handleOkModal}
      visible={props.openColorsModal}
      okButtonProps={{
        loading: props.loading,
      }}
    >
      <div className="WebsitesConfigurations__colorsItemForm">
        <b>
          {props.intl.formatMessage({
            id: 'website_colors_marker',
            defaultMessage: 'Marker color',
          })}
          :
        </b>{' '}
        <input
          type={'color'}
          value={markerColor}
          onChange={e => handleChangeMarkerColor(e.target.value)}
        />
      </div>
      <div className="WebsitesConfigurations__colorsItemForm">
        <b>
          {props.intl.formatMessage({
            id: 'website_colors_text',
            defaultMessage: 'Marker text',
          })}
          :
        </b>{' '}
        <input
          type={'color'}
          value={textColor}
          onChange={e => handleChangeTextColor(e.target.value)}
        />
      </div>
    </Modal>
  );
};

SelectColorModal.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  handleSubmitColors: PropTypes.func.isRequired,
  openColorsModal: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  setOpenColorsModal: PropTypes.func.isRequired,
  colors: PropTypes.shape({
    mapMarkerBody: PropTypes.string,
    mapMarkerText: PropTypes.string,
  }).isRequired,
};

export default injectIntl(SelectColorModal);
