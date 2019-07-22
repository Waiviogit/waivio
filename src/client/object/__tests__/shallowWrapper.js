import {mount, shallow} from 'enzyme';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import React from 'react';
import {MemoryRouter as Router} from 'react-router-dom';

export const shallowWithStore = (component, store) => shallow(
  <Provider store={store}>
    <IntlProvider locale={'en'}>
      <Router>{component}</Router>
    </IntlProvider>
  </Provider>,
);


export const shallowWithoutStore = component => shallow(
  <IntlProvider locale={'en'} messages={"i18nConfig['en'].messages"}>
    {component}
  </IntlProvider>,
);


export const shallowSmart = (component, store) => {
  const core = (
    <IntlProvider locale={'en'} messages={"i18nConfig['en'].messages"}>
      {component}
    </IntlProvider>
  );
  if (store) {
    return shallow(<Provider store={store}>{core}</Provider>);
  }
  return shallow(core);

};

export const mountSmart = (component, store) => {
  const core = (
    <IntlProvider locale={'en'} messages={"i18nConfig['en'].messages"}>
      {component}
    </IntlProvider>
  );
  if (store) {
    return mount(<Provider store={store}>{core}</Provider>);
  }
  return mount(core);

};

export const mountWithStore = (component, store) => mount(
  <Provider store={store}>
    <IntlProvider locale={'en'}>
      <Router>{component}</Router>
    </IntlProvider>
  </Provider>,
);

export const mountWithoutStore = component => mount(
  <IntlProvider locale={'en'} messages={"i18nConfig['en'].messages"}>
    {component}
  </IntlProvider>,
);
