import { shallow, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';

export const shallowWithStore = (component, store) => {
  return shallow(
    <Provider store={store}>
      <IntlProvider locale={'en'}>
        <Router>{component}</Router>
      </IntlProvider>
    </Provider>,
  );
};

export const shallowWithoutStore = component => {
  return shallow(
    <IntlProvider locale={'en'} messages={"i18nConfig['en'].messages"}>
      {component}
    </IntlProvider>,
  );
};

export const shallowSmart = (component, store) => {
  const core = (
    <IntlProvider locale={'en'} messages={"i18nConfig['en'].messages"}>
      {component}
    </IntlProvider>
  );
  if (store) {
    return shallow(<Provider store={store}>{core}</Provider>);
  } else {
    return shallow(core);
  }
};

export const mountSmart = (component, store) => {
  const core = (
    <IntlProvider locale={'en'} messages={"i18nConfig['en'].messages"}>
      {component}
    </IntlProvider>
  );
  if (store) {
    return mount(<Provider store={store}>{core}</Provider>);
  } else {
    return mount(core);
  }
};

export const mountWithStore = (component, store) => {
  return mount(
    <Provider store={store}>
      <IntlProvider locale={'en'}>
        <Router>{component}</Router>
      </IntlProvider>
    </Provider>,
  );
};

export const mountWithoutStore = component => {
  return mount(
    <IntlProvider locale={'en'} messages={"i18nConfig['en'].messages"}>
      {component}
    </IntlProvider>,
  );
};
