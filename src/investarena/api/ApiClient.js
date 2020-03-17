import axios from 'axios';
// import { updateHeaders } from '../redux/actions/authenticate/headers';

export default class ApiClient {
  constructor({ prefix = 'localhost:8095' } = {}) {
    this.prefix = prefix;
  }

  get(requestUrl, payload = {}, params) {
    return request({
      url: `${this.prefix}${requestUrl}`,
      method: 'get',
      data: payload,
      params,
    });
  }

  put(requestUrl, payload = {}) {
    return request({
      url: `${this.prefix}${requestUrl}`,
      method: 'put',
      data: payload,
    });
  }

  post(requestUrl, payload = {}) {
    return request({
      url: `${this.prefix}${requestUrl}`,
      method: 'post',
      data: payload,
    });
  }

  delete(requestUrl) {
    return request({
      url: `${this.prefix}${requestUrl}`,
      method: 'delete',
    });
  }

  validateToken(requestUrl, headers) {
    return axios({ method: 'GET', url: `${this.prefix}${requestUrl}`, headers }).then(
      response => {
        if (response.data && response.data.data) {
          response.data = response.data.data;
        }
        // if (response.headers) {
        //     updateHeaders(response.headers);
        // }
        return response;
      },
      () => ({}),
    );
  }
}

const request = ({ url, method, data, params = {} }) =>
  axios({
    method,
    url,
    params,
    data,
  }).then(
    response => {
      // if (response.headers) {
      //     updateHeaders(response.headers);
      // }
      if (response.status >= 200 && response.status < 300) {
        if (response.data && response.data.data) {
          response.data = response.data.data;
        }
        return response;
      }
    },
    xhr => {
      // if (xhr.response && xhr.response.headers) {
      //     updateHeaders(xhr.response.headers);
      // }
      debugger;
      const response = { error: {} };
      response.error.statusCode = (xhr && xhr.response && xhr.response.status) || 500;
      response.error.status = 'error';
      response.error.toString = () => {
        let result = 'Bad response from server';
        if (xhr && xhr.response && xhr.response.data) {
          const errors = xhr.response.data.errors || xhr.response.data.error;
          if (errors && errors.full_messages) {
            result = errors.full_messages.toString();
          } else if (errors) {
            result = errors.message || errors.toString();
          }
        } else {
          result = xhr.message;
        }
        return result;
      };
      response.error.message = response.error.toString();
      return response;
    },
  );
