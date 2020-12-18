import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import Map from 'pigeon-maps';
import mapProvider from '../../../helpers/mapProvider';
import './WebsiteObjects.less';

const WebsiteObjects = ({ intl }) => {
  const zoomButtonsLayout = () => (
    <div className="WebsiteObjectsControl">
      <div className="WebsiteObjectsControl__gps">
        <div
          role="presentation"
          className="WebsiteObjectsControl__locateGPS"
          // onClick={setPosition}
        >
          <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
        </div>
      </div>
      <div className="WebsiteObjectsControl__zoom">
        <div
          role="presentation"
          className="WebsiteObjectsControl__zoom__button"
          // onClick={incrementZoom}
        >
          +
        </div>
        <div
          role="presentation"
          className="WebsiteObjectsControl__zoom__button"
          // onClick={decrementZoom}
        >
          -
        </div>
      </div>
    </div>
  );

  return (
    <div className="WebsiteObjects">
      <h1 className="WebsiteObjects__heading">
        <FormattedMessage id="website_objects_heading" defaultMessage="Select objects" />
      </h1>
      {intl.formatMessage({
        id: 'website_objects_description',
        defaultMessage:
          'All objects (restaurants, dishes, drinks) located in the areas specified on the map will appear on the website. If you want to have more control over the list of objects, you can use the Authorities to do so.',
      })}
      <div className="MapWrap">
        <div className="MapWrap__new-aria-btn">
          <Icon type="plus-circle" theme="filled" />
        </div>
        {zoomButtonsLayout()}
        <Map
          center={[48.539885811540834, 35.338863789062486]}
          zoom={8}
          height={400}
          provider={mapProvider}
          // onBoundsChanged={state => {
          //   onBoundsChanged(state);
          // }}
        />
      </div>
    </div>
  );
};

WebsiteObjects.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default withRouter(injectIntl(WebsiteObjects));
