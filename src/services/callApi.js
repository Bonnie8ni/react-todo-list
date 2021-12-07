/* eslint-disable import/no-anonymous-default-export */

export const getPostJsonData = (params, method) => {
    if (method === 'GET' || method === 'HEAD') return null;
    return JSON.stringify(params);
}

export const callApi = (requestUrl, method, params = {}) => {
    const postJson = getPostJsonData(params, method);
    const credentials = process.env.NODE_ENV === 'production' && { credentials: 'include' };

    return fetch(requestUrl, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: postJson,
        method: method,
        ...credentials
    })
        .then((response) => {
            return response.status === 200 && 
            response.json().then((json) => ({ json, response }));
        })
        .then(({ json, response }) => {
            if (!response) { return Promise.reject(json) }
            return Object.assign({}, json);
        })
}

export default {
    get: (requestUrl, params) => callApi(requestUrl, 'GET', params),
    post: (requestUrl, params) => callApi(requestUrl, 'POST', params),
    put: (requestUrl, params) => callApi(requestUrl, 'PUT', params),
    patch: (requestUrl, params) => callApi(requestUrl, 'PATCH', params),
    delete: (requestUrl, params) => callApi(requestUrl, 'DELETE', params),
};
