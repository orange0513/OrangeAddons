import { request, nonThreadedRequest } from "./src/request";

const axios = {
    /**
     * Send a GET request
     * @param {string|RequestOptions} urlOrOptions - The URL to send the request to or the options to use
     * @param {RequestOptionsNoUrl} [options] - The options to use for this request
     * @returns {Promise<AxiosResponse>} - The response object as a promise
     * @throws {AxiosError}
     */
    get: function(urlOrOptions, options) {
        if (typeof urlOrOptions === 'string') {
            options = options || {}
            options.url = urlOrOptions;
        } else {
            options = urlOrOptions;
        }

        options.method = "GET";

        return request(options)
    },
    /**
     * Send a DELETE request
     * @param {string|RequestOptions} urlOrOptions - The URL to send the request to or the options to use
     * @param {RequestOptionsNoUrl} [options] - The options to use for this request
     * @returns {Promise<AxiosResponse>} - The response object as a promise
     * @throws {AxiosError}
     */
    delete: function(urlOrOptions, options) {
        if (typeof urlOrOptions === 'string') {
            options = options || {}
            options.url = urlOrOptions;
        } else {
            options = urlOrOptions;
        }

        options.method = "DELETE";

        return request(options)
    },
    /**
     * Send an OPTIONS request
     * @param {string|RequestOptions} urlOrOptions - The URL to send the request to or the options to use
     * @param {RequestOptionsNoUrl} [options] - The options to use for this request
     * @returns {Promise<AxiosResponse>} - The response object as a promise
     * @throws {AxiosError}
     */
    options: function(urlOrOptions, options) {
        if (typeof urlOrOptions === 'string') {
            options = options || {}
            options.url = urlOrOptions;
        } else {
            options = urlOrOptions;
        }

        options.method = "OPTIONS";

        return request(options)
    },
    /**
     * Send a HEAD request
     * @param {string|RequestOptions} urlOrOptions - The URL to send the request to or the options to use
     * @param {RequestOptionsNoUrl} [options] - The options to use for this request
     * @returns {Promise<AxiosResponse<undefined>>} - The response object as a promise
     * @throws {AxiosError}
     */
    head: function(urlOrOptions, options) {
        if (typeof urlOrOptions === 'string') {
            options = options || {}
            options.url = urlOrOptions;
        } else {
            options = urlOrOptions;
        }

        options.method = "HEAD";

        return request(options)
    },
    /**
     * Send a POST request
     * @param {string|RequestOptions} urlOrOptions - The URL to send the request to or the options to use
     * @param {RequestOptionsNoUrl} [options] - The options to use for this request
     * @returns {Promise<AxiosResponse>} - The response object as a promise
     * @throws {AxiosError}
     */
    post: function(urlOrOptions, options) {
        if (typeof urlOrOptions === 'string') {
            options = options || {}
            options.url = urlOrOptions;
        } else {
            options = urlOrOptions;
        }

        options.method = "POST";

        return request(options)
    },
    /**
     * Send a PUT request
     * @param {string|RequestOptions} urlOrOptions - The URL to send the request to or the options to use
     * @param {RequestOptionsNoUrl} [options] - The options to use for this request
     * @returns {Promise<AxiosResponse>} - The response object as a promise
     * @throws {AxiosError}
     */
    put: function(urlOrOptions, options) {
        if (typeof urlOrOptions === 'string') {
            options = options || {}
            options.url = urlOrOptions;
        } else {
            options = urlOrOptions;
        }

        options.method = "PUT";

        return request(options)
    },
    /**
     * Send a PATCH request
     * @param {string|RequestOptions} urlOrOptions - The URL to send the request to or the options to use
     * @param {RequestOptionsNoUrl} [options] - The options to use for this request
     * @returns {Promise<AxiosResponse>} - The response object as a promise
     * @throws {AxiosError}
     */
    patch: function(urlOrOptions, options) {
        if (typeof urlOrOptions === 'string') {
            options = options || {}
            options.url = urlOrOptions;
        } else {
            options = urlOrOptions;
        }

        options.method = "PATCH";

        return request(options)
    }
}

/**
 * Send a request using the traditional requestV2 syntax.
 * @param {RequestOptions} options - The options to use for this request
 * @returns {Promise<AxiosResponse>} - The response object as a promise
 * @throws {AxiosError}
 * @deprecated Use request instead
 */
function defaultRequest(options) {
    console.warn("defaultRequest is deprecated. Use request instead.");
    return request(options)
}

export { defaultRequest, request, nonThreadedRequest, axios as default };