import React from 'react';
import { mount } from 'enzyme';
import ObjectSearchCard from '../ObjectSearchCard/ObjectSearchCard';

describe('<ObjectSearchCard />', () => {
  let props;
  let wrapper;
  let searchCard;
  let contentType;
  let contentInfo;
  let contentName;

  beforeEach(() => {
    props = {
      object: {},
      name: 'name',
      type: 'type',
      parentElement: '-parentElement',
    };
    wrapper = mount(<ObjectSearchCard {...props}>children</ObjectSearchCard>);
    searchCard = wrapper.find('.object-search-card');
    contentType = searchCard.find('.object-search-card__content-type');
    contentInfo = searchCard.find('.object-search-card__content-info');
    contentName = contentInfo.find('.object-search-card__content-name');
  });

  afterEach(() => jest.clearAllMocks());

  it('Should not be undefined', () => {
    expect(wrapper).not.toBeUndefined();
  });

  it('searchCard should not be undefined', () => {
    expect(searchCard).not.toBeUndefined();
  });

  it('contentType should not be undefined', () => {
    expect(contentType).not.toBeUndefined();
  });

  it('contentInfo should not be undefined', () => {
    expect(contentInfo).not.toBeUndefined();
  });

  it('contentName should not be undefined', () => {
    expect(contentName).not.toBeUndefined();
  });
});
