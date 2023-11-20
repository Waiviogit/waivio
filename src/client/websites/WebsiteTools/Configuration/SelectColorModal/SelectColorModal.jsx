import { Button, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { initialColors } from '../../../constants/colors';

const SelectColorBlock = props => {
  const [markerColor, setMarkerColor] = useState('');
  const [textColor, setTextColor] = useState('');

  const setDefaultColors = () => {
    setMarkerColor(props.colors.mapMarkerBody || initialColors.marker);
    setTextColor(props.colors.mapMarkerText || initialColors.text);
  };

  useEffect(() => {
    setDefaultColors();
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
    setDefaultColors();
  };
  const handleOkModal = () =>
    props.handleSubmitColors({
      mapMarkerBody: markerColor,
      mapMarkerText: textColor,
    });

  return (
    <div>
      <h3>
        {props.intl.formatMessage({
          id: 'website_colors',
          defaultMessage: 'Website colors',
        })}
        :
      </h3>
      <div className="WebsitesConfigurations__colors-wrap">
        <div className="WebsitesConfigurations__colorsItem">
          <div
            className="WebsitesConfigurations__colors"
            style={{ backgroundColor: props.colors.mapMarkerBody || initialColors.marker }}
          />
          <b>
            {props.intl.formatMessage({
              id: 'website_colors_main',
              defaultMessage: 'Main color',
            })}
          </b>
        </div>
        <div className="WebsitesConfigurations__colorsItem">
          <div
            className="WebsitesConfigurations__colors"
            style={{ backgroundColor: props.colors.mapMarkerText || initialColors.text }}
          />
          <b>
            {props.intl.formatMessage({
              id: 'website_colors_text',
              defaultMessage: 'Text color',
            })}
          </b>
        </div>
      </div>
      <Button type="primary" onClick={() => props.setOpenColorsModal(true)}>
        {props.intl.formatMessage({
          id: 'select_color',
          defaultMessage: 'Select color',
        })}
      </Button>
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
              id: 'website_colors_main',
              defaultMessage: 'Main color',
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
              defaultMessage: 'Text color',
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
    </div>
  );
};

SelectColorBlock.propTypes = {
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

export default injectIntl(SelectColorBlock);
