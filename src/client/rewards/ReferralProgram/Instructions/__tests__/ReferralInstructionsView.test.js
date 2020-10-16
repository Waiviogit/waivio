// import React from 'react';
// import {BrowserRouter} from 'react-router-dom';
// import configureStore from 'redux-mock-store';
// import {shallow, mount} from 'enzyme';
// import ReferralInstructionsView from '../../Instructions/ReferralInstructionsView';
// import {mockDataView} from '../__mock__/mockData';
// import {Provider} from "react-redux";
// import {IntlProvider} from "react-intl";
//
//
// describe('ReferralInstructionsView', () => {
//   const mockStore = configureStore();
//   const handleCopyTextButton = jest.fn();
//   const widget = `<iframe></iframe>`;
//
//   let props;
//   let wrapper;
//   let store;
//
//   beforeEach(() => {
//     props = mockDataView;
//
//     store = mockStore();
//     wrapper = shallow(
//       <Provider store={store}>
//         <IntlProvider locale="en">
//           {ReferralInstructionsView(props, handleCopyTextButton, widget)}
//         </IntlProvider>
//       </Provider>
//     )
//   })
//
//   it('should create snapshot', () => {
//     expect(wrapper).toMatchSnapshot();
//   });
//
//   it("should simulate chackbox button", () => {
//     wrapper = shallow(
//       <BrowserRouter>
//         <IntlProvider locale="en">
//           {ReferralInstructionsView(props, handleCopyTextButton, widget)}
//         </IntlProvider>
//       </BrowserRouter>
//     )
//
//     const checkbox = wrapper.find('Checkbox')
//     console.log('checkbox: ', checkbox.debug())
//
//     checkbox.simulate('change');
//     expect(props.handleAgreeRulesCheckbox).toHaveBeenCalled();
//   });
// })
//
// // describe('ReferralInstructionsView', () => {
// //   const mockStore = configureStore();
// //   const widget = `<iframe></iframe>`;
// //   const handleAgreeRulesCheckbox = jest.fn();
// //
// //   it("create InstructionsView's page snapshot", () => {
// //     const wrapper = mountWithIntl(
// //       <BrowserRouter>
// //         <Route
// //           path="/rewards/referral-details/vallon"
// //           component={ReferralInstructionsView(mockDataView, handleAgreeRulesCheckbox, widget)}
// //         />
// //       </BrowserRouter>,
// //     );
// //     act(() => {
// //       wrapper.update();
// //     });
// //     expect(wrapper).toMatchSnapshot();
// //   });
// //
// //   it("should simulate copy text button", () => {
// //
// //   })
// // });
