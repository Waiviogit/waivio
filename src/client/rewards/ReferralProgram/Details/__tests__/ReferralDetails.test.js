// import {shallow} from "enzyme";
// import {BrowserRouter} from "react-router-dom";
// import {IntlProvider} from "react-intl";
// import React from "react";
// import {mockDataDetails} from "../__mock__/mockData";
// import ReferralDetails from "../ReferralDetails";
//
// describe('ReferralDetail', () => {
//   let props;
//   let wrapper;
//   let useEffect;
//
//   beforeEach(() => {
//     jest.spyOn(React, "useEffect").mockImplementation(f => f());
//     props = mockDataDetails;
//     wrapper = shallow(
//       <BrowserRouter>
//         <IntlProvider locale="en">
//           <ReferralDetails props={props} />
//         </IntlProvider>
//       </BrowserRouter>,
//     );
//   });
//
//   afterEach(() => jest.clearAllMocks());
//
//   it('useEffect should return ReferralDetailsView', () => {
//     console.log('wrapper: ', wrapper.debug())
//     expect(props.getReferralDetails).toHaveBeenCalled();
//   })
// })
