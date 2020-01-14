import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const EconomicalCalendar = ({ intl }) => {
  const localeCalender = intl.locale ? intl.locale.slice(0, 2).toUpperCase() : 'EN';

  return (
    <div style={{ maxWidth: '1010px', margin: '0 auto' }}>
      <iframe
        title="economical-calendar"
        src={`https://informer.investforum.ru/widgetsws/EconomicalCalendar.html#/&amp;css=maximarkets&amp;checkedCountries=AR,AU,AT,BE,BR,CA,CL,CN,CO,CZ,DK,EMU,DE,FI,FR,GR,HK,HU,IS,IN,ID,IE,IT,JP,MX,NL,NZ,NO,PL,PT,RO,RU,SG,SK,ZA,KR,ES,SE,CH,TR,UK,US,PE&lang=${localeCalender}&amp;showFilters=true&amp;isLocalTime=true&amp;volatility=0&amp;countdown=true&amp;showTimeZones=true?_k=fo4egv`}
        style={{ width: '100%', minHeight: '85vh', border: 'none' }}
      />
    </div>
  );
};

EconomicalCalendar.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(EconomicalCalendar);
