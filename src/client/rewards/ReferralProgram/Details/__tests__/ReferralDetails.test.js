// import React from "react";
// import {render, screen, act} from "@testing-library/react"
// // import {renderHook, act} from '@testing-library/react-hooks';
// // import { mount } from 'enzyme';
// // import {Provider} from "react-redux";
// // import { render, unmountComponentAtNode } from "react-dom";
// // import configureStore from 'redux-mock-store';
// // import { act } from "react-dom/test-utils";
// // import {mockData, mockDataDetails} from "../__mock__/mockData";
// // import {Route} from "react-router";
// // import {BrowserRouter} from "react-router-dom";
// import ReferralDetail from "../ReferralDetails";
// import {Route} from "react-router";
// import {BrowserRouter} from "react-router-dom";
// import {mockDataDetails} from "../__mock__/mockData";
//
// global.fetch = jest.fn(() => Promise.resolve({
//   json: () => Promise.resolve({
//     isAuthenticated: true,
//     getReferralDetails: () => {},
//     campaignServerPercent: 50,
//     indexAbsolutePercent: 60,
//     indexServerPercent: 30,
//     referralDuration: 90,
//     referralServerPercent: 20,
//     suspendedTimer: 30,
//     username: 'vallon',
//   })
// }))
// describe('ReferralDetail', () => {
//   it('jasdjas', async () => {
//     await act(async () => render(<BrowserRouter>
//       <Route path="/rewards/referral-details/vallon"
//              component={<ReferralDetail props={mockDataDetails} />}/>
//     </BrowserRouter>));
//     expect(screen.getByText('90 days')).toBeInTheDocument();
//   })
//   // const mockStore = configureStore();
//   // const getReferralDetails = jest.fn();
//   // let wrapper;
//   // beforeEach(() => {
//   //   wrapper = mount(
//   //     <BrowserRouter>
//   //       <Route path="/rewards/referral-details/vallon"
//   //              component={<ReferralDetail getReferralDetails={getReferralDetails}/>}/>
//   //     </BrowserRouter>
//   //   )
//   // })
//   // const received = false;
//   // const expected = true;
//
//   it('should be render component', async () => {
//
//   })
//   // jest.mock('../../../../../waivioApi/ApiClient', () => { })
//   // jest.mock('../../ReferralTextHelper', () => { })
//   // let container = null;
//   // const mockStore = configureStore();
//   //
//   // beforeEach(() => {
//   //   container = document.createElement("div");
//   //   document.body.appendChild(container);
//   // });
//   //
//   // afterEach(() => {
//   //   unmountComponentAtNode(container);
//   //   container.remove();
//   //   container = null;
//   // });
//
//   // it('should to have been call getReferralDetails', () => {
//   //   const props = mockDataDetails;
//   //   const getReferralDetails = jest.fn();
//   //   props.getReferralDetails = getReferralDetails;
//   //   act(() => {
//   //     render(
//   //       <BrowserRouter>
//   //         <Route path="/rewards/referral-details/vallon" component={<ReferralDetail props={props} />}/>
//   //       </BrowserRouter>,
//   //       // <Provider store={store}>
//   //       //   {ReferralDetail(props)}
//   //       // </Provider>,
//   //       container
//   //     )
//   //   })
//   //   expect(props.getReferralDetails).not.toHaveBeenCalled();
//   // })
//   //
//   // it('should to have been call ReferralDetailsView', () => {
//   //   const props = mockDataDetails;
//   //   const ReferralDetailsView = jest.fn();
//   //   act(() => {
//   //     render(
//   //       <BrowserRouter>
//   //         <Route path="/rewards/referral-details/vallon" component={<ReferralDetail props={props} />}/>
//   //       </BrowserRouter>,
//   //       // <Provider store={store}>
//   //       //   {ReferralDetail(props)}
//   //       // </Provider>,
//   //       container
//   //     )
//   //   })
//   //   expect(ReferralDetailsView).not.toHaveBeenCalled();
//   // })
// })
//
