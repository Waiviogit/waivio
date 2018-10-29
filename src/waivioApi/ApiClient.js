// import axios from 'axios';
// import config from './config.json';
//
// const request = ({
//                    url, method, data, params = {},
//                  }) => axios({
//     method,
//     url,
//     params,
//     data,
//   })
//     .then((response) => {
//       if (response.status >= 200 && response.status < 300) {
//         if (response.data && response.data.data) {
//           response.data = response.data.data;
//         }
//         return response;
//       }
//     }).catch((xhr) => {
//       const response = { error: {} };
//       response.error.statusCode = (xhr && xhr.response && xhr.response.status) || 500;
//       response.error.status = 'error';
//       response.error.toString = () => {
//         let result = 'Bad response from server';
//         if (xhr && xhr.response && xhr.response.data) {
//           const errors = xhr.response.data.errors || xhr.response.data.error;
//           if (errors && errors.full_messages) {
//             result = errors.full_messages.toString();
//           } else if (errors) {
//             result = errors.toString();
//           }
//         } else {
//           result = xhr.message;
//         }
//         return result;
//       };
//       throw response;
//     });
//
// export default class ApiClient {
//
//     constructor({ prefix = config[`API_HOST_${process.env.NODE_ENV}`] } = {}) {
//         this.prefix = prefix;
//     }
//
//     get(requestUrl, payload = {}, params) {
//         return request({
//             url: `${this.prefix}${requestUrl}`,
//             method: 'get',
//             data: payload,
//             params,
//         });
//     }
//
//     put(requestUrl, payload = {}) {
//         return request({
//             url: `${this.prefix}${requestUrl}`,
//             method: 'put',
//             data: payload,
//         });
//     }
//
//     post(requestUrl, payload = {}) {
//         return request({
//             url: `${this.prefix}${requestUrl}`,
//             method: 'post',
//             data: payload,
//         });
//     }
//
//     delete(requestUrl) {
//         return request({
//             url: `${this.prefix}${requestUrl}`,
//             method: 'delete',
//         });
//     }
// }
//
