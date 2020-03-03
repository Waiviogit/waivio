import React from 'react';
import { mountWithIntl } from 'enzyme-react-intl';
import { act } from 'react-dom/test-utils';
import MatchBotTable from '../MatchBotTable/MatchBotTable';

jest.mock('../MatchBotTable/MatchBotTableRow', () => () => <tr className="MatchBotTableRow" />);

describe('MatchBotTable', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      handleEditRule: () => {},
      handleSwitcher: () => {},
      isAuthority: true,
      rules: [{ bot_name: 'asd09' }],
    };

    act(() => {
      wrapper = mountWithIntl(<MatchBotTable {...props} />);
    });
  });

  it('Component have one table', () => {
    act(() => {
      wrapper.update();
    });
    const component = wrapper.find('table');
    expect(component).toHaveLength(1);
  });

  it('Fields with tag th is 6', () => {
    act(() => {
      wrapper.update();
    });
    const component = wrapper.find('th');
    expect(component).toHaveLength(6);
  });

  it('Elements with class basicWidth is 3', () => {
    act(() => {
      wrapper.update();
    });
    const component = wrapper.find('.basicWidth');
    expect(component).toHaveLength(3);
  });

  it('Elements with class sponsorWidth is 1', () => {
    act(() => {
      wrapper.update();
    });
    const component = wrapper.find('.sponsorWidth');
    expect(component).toHaveLength(1);
  });

  it('Elements with class dateWidth is 1', () => {
    act(() => {
      wrapper.update();
    });
    const component = wrapper.find('.dateWidth');
    expect(component).toHaveLength(1);
  });

  it('Elements with class notesWidth is 1', () => {
    act(() => {
      wrapper.update();
    });
    const component = wrapper.find('.notesWidth');
    expect(component).toHaveLength(1);
  });
});
