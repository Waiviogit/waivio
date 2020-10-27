// import React from "react";
// import {render} from "react-dom";
// import {shallow} from "enzyme";
// import {BrowserRouter} from "react-router-dom";
// import {Provider} from "react-redux";
// import thunk from "redux-thunk";
// import {IntlProvider} from "react-intl";
// import configureMockStore from 'redux-mock-store'
// import CatalogWrap from "../CatalogWrap";
// import * as apiClient from '../../../../waivioApi/ApiClient';
// import {getObject} from "../../../../waivioApi/ApiClient";
// import {MOCK_DATA_RESPONSE_GET_OBJECT} from "./mockData";
//
//
// describe('Catalog Wrap', () => {
//   let props;
//   let initialState;
//   let container;
//
//   const mockStore = configureMockStore([thunk]);
//   const store = mockStore(initialState);
//
//   const setComponent = (initialState, props) => (
//     shallow(
//       <Provider store={store}>
//         <BrowserRouter>
//           <IntlProvider locale="en">
//             <CatalogWrap {...props} />
//           </IntlProvider>
//         </BrowserRouter>
//       </Provider>,
//       store
//     )
//   )
//
//   beforeEach(() => {
//     props = {
//       history: {},
//       intl: {},
//       listItems: [],
//       locale: 'en-US',
//       wobjectNested: MOCK_DATA_RESPONSE_GET_OBJECT,
//       wobject: MOCK_DATA_RESPONSE_GET_OBJECT,
//       userName: 'name',
//       location: {hash: 'hash-test'},
//       getObjectCreator: jest.fn(),
//       setListItems: jest.fn(),
//       setNestedWobject: jest.fn(),
//       isEditMode: false,
//     }
//
//     initialState = {
//       object: {
//         nestedWobject: {}
//       }
//     }
//
//   });
//
//   const spyGetObject = jest.spyOn(apiClient, 'getObject');
//   const isGetObjetc = getObject();
//
//   it("get objects with backend in methods getObject", () => {
//     container = setComponent(store, props);
//     expect(props.setListItems).toHaveBeenCalledTimes(0);
//     expect(container.find('Connect(InjectIntl(withRouter(CatalogWrap)))').at(0).getElement().props.location).toEqual({hash: 'hash-test'});
//     const nextProps = {
//       ...props,
//       location: {
//         hash: 'url-lalal'
//       }
//     };
//     container = setComponent(store, nextProps);
//     expect(container.find('Connect(InjectIntl(withRouter(CatalogWrap)))').at(0).getElement().props.location).toEqual({hash: 'url-lalal'});
//     //expect(props.setListItems).toHaveBeenCalledTimes(1);
//   });
//
// });
