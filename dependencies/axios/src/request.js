import Promise from "../../PromiseV2/index"
import { parseOptions, stringifyQuery } from "./utils"
import { socketFactory, acceptedContentEncoding } from "../loader"

const URL = Java.type("java.net.URL")
const JavaString = Java.type("java.lang.String")
const StandardCharsets = Java.type("java.nio.charset.StandardCharsets")
const CompletableFuture = Java.type("java.util.concurrent.CompletableFuture")
const InflaterInputStream = Java.type("java.util.zip.InflaterInputStream")
const GZIPInputStream = Java.type("java.util.zip.GZIPInputStream")
const BrotliInputStream = Java.type("org.brotli.dec.BrotliInputStream")
const BufferedReader = Java.type("java.io.BufferedReader")
const InputStreamReader = Java.type("java.io.InputStreamReader")

const outputMethods = ["POST", "PUT", "PATCH"]

/**
 * Send a request using the traditional requestV2 syntax.
 * @param {RequestOptions} options - The options to use for this request
 * @returns {Promise<AxiosResponse>} - The response object as a promise
 * @throws {AxiosError}
 */
export function request(options) {
    options = parseOptions(options)
    if (!options.url) {
        throw new Error("No request URL specified")
    }

    return new Promise((resolve, reject) => {
        CompletableFuture.runAsync(() => {
            let queryString = "?" + stringifyQuery(options.query)
            if (queryString.length > 1) {
                options.url += queryString
            }

            const connection = new URL(options.url).openConnection()
            if (options.url.startsWith("https")) connection.setSSLSocketFactory(socketFactory)
            connection.setRequestMethod(options.method)
            connection.setDoInput(true)
            if (outputMethods.includes(options.method)) {
                connection.setDoOutput(true)
            }
            connection.setConnectTimeout(options.connectTimeout)
            connection.setReadTimeout(options.readTimeout)
            connection.setInstanceFollowRedirects(options.followRedirect)
            connection.setRequestProperty("Accept-Encoding", acceptedContentEncoding.join(", "))
            options.headers.forEach((value, key) => connection.setRequestProperty(key, value))

            if (outputMethods.includes(options.method)) {
                let body = []
                if (options.bytes) {
                    body = options.bytes
                } else {
                    if (typeof options.body === "object") {
                        body = new JavaString(JSON.stringify(options.body)).getBytes(StandardCharsets.UTF_8)
                        connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                    } else if (typeof options.form === "object") {
                        body = new JavaString(stringifyQuery(options.form)).getBytes(StandardCharsets.UTF_8)
                        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
                        connection.setRequestProperty("Content-Length", body.length)
                    }
                }
                const outputStream = connection.getOutputStream()
                outputStream.write(body)
                outputStream.close()
            }

            let headers = {}
            let headerFields = connection.getHeaderFields()
            headerFields.forEach((key, value) => {
                if (options.parseHeaders) {
                    try {
                        value = options.headersParser(value)
                    } catch (e) {
                        if (options.headersParser !== JSON.parse) {
                            throw e
                        }
                    }
                }
                headers[key] = value[0]
            })

            const status = connection.getResponseCode()

            if (options.method === "HEAD") {
                if (!options.validateStatus(status)) {
                    return reject({
                        code: status,
                        response: {
                            status: status,
                            statusText: connection.getResponseMessage(),
                            headers
                        },
                        isAxiosError: true
                    })
                } else {
                    return resolve({
                        status: status,
                        statusText: connection.getResponseMessage(),
                        headers
                    })
                }
            }
            let inputStream = status > 299 ? connection.getErrorStream() : connection.getInputStream()
            switch (connection.getContentEncoding()?.toLowerCase()) {
                case "gzip":
                    inputStream = new GZIPInputStream(inputStream)
                    break
                case "deflate":
                    inputStream = new InflaterInputStream(inputStream)
                    break
                case "br":
                    inputStream = new BrotliInputStream(inputStream)
                    break
            }

            const reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))
            let data = ""
            let chunk = ""
            while ((chunk = reader.readLine()) !== null) {
                data += chunk
            }
            reader.close()
            inputStream.close()
            connection.disconnect()

            if (options.parseBody && data) {
                try {
                    data = options.bodyParser(data)
                } catch (e) {
                    if (options.bodyParser !== JSON.parse) {
                        throw e
                    }
                }
            }

            if (!options.validateStatus(status)) {
                return reject({
                    code: status,
                    response: {
                        status: status,
                        statusText: connection.getResponseMessage(),
                        headers,
                        data
                    },
                    isAxiosError: true
                })
            } else {
                return resolve({
                    status: status,
                    statusText: connection.getResponseMessage(),
                    headers,
                    data
                })
            }
        }).exceptionally(throwable => {
            let error = new Error(throwable.getMessage())
            error.stack = throwable.getStackTrace().toString()
            error.isAxiosError = false
            return reject(error)
        })
    })
}

/**
 * Send a request using the traditional requestV2 syntax.
 * @param {RequestOptions} options - The options to use for this request
 * @returns {AxiosResponse} - The response object
 * @throws {AxiosError}
 */
export function nonThreadedRequest(options) {
    options = parseOptions(options)
    if (!options.url) {
        throw new Error("No request URL specified")
    }

    let queryString = "?" + stringifyQuery(options.query)
    if (queryString.length > 1) {
        options.url += queryString
    }

    const connection = new URL(options.url).openConnection()
    if (options.url.startsWith("https")) connection.setSSLSocketFactory(socketFactory)
    connection.setRequestMethod(options.method)
    connection.setDoInput(true)
    if (outputMethods.includes(options.method)) {
        connection.setDoOutput(true)
    }
    connection.setConnectTimeout(options.connectTimeout)
    connection.setReadTimeout(options.readTimeout)
    connection.setInstanceFollowRedirects(options.followRedirect)
    connection.setRequestProperty("Accept-Encoding", acceptedContentEncoding.join(", "))
    options.headers.forEach((value, key) => connection.setRequestProperty(key, value))

    if (outputMethods.includes(options.method)) {
        let body = []
        if (options.bytes) {
            body = options.bytes
        } else {
            if (typeof options.body === "object") {
                body = new JavaString(JSON.stringify(options.body)).getBytes(StandardCharsets.UTF_8)
                connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8")
            } else if (typeof options.form === "object") {
                body = new JavaString(stringifyQuery(options.form)).getBytes(StandardCharsets.UTF_8)
                connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
                connection.setRequestProperty("Content-Length", body.length)
            }
        }
        const outputStream = connection.getOutputStream()
        outputStream.write(body)
        outputStream.close()
    }

    let headers = {}
    let headerFields = connection.getHeaderFields()
    headerFields.forEach((key, value) => {
        if (options.parseHeaders) {
            try {
                value = options.headersParser(value)
            } catch (e) {
                if (options.headersParser !== JSON.parse) {
                    throw e
                }
            }
        }
        headers[key] = value[0]
    })

    const status = connection.getResponseCode()

    if (options.method === "HEAD") {
        if (!options.validateStatus(status)) {
            throw ({
                code: status,
                response: {
                    status: status,
                    statusText: connection.getResponseMessage(),
                    headers
                },
                isAxiosError: true
            })
        } else {
            return ({
                status: status,
                statusText: connection.getResponseMessage(),
                headers
            })
        }
    }
    let inputStream = status > 299 ? connection.getErrorStream() : connection.getInputStream()
    switch (connection.getContentEncoding()?.toLowerCase()) {
        case "gzip":
            inputStream = new GZIPInputStream(inputStream)
            break
        case "deflate":
            inputStream = new InflaterInputStream(inputStream)
            break
        case "br":
            inputStream = new BrotliInputStream(inputStream)
            break
    }

    const reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))
    let data = ""
    let chunk = ""
    while ((chunk = reader.readLine()) !== null) {
        data += chunk
    }
    reader.close()
    inputStream.close()
    connection.disconnect()

    if (options.parseBody && data) {
        try {
            data = options.bodyParser(data)
        } catch (e) {
            if (options.bodyParser !== JSON.parse) {
                throw e
            }
        }
    }

    if (!options.validateStatus(status)) {
        throw ({
            code: status,
            response: {
                status: status,
                statusText: connection.getResponseMessage(),
                headers,
                data
            },
            isAxiosError: true
        })
    } else {
        return ({
            status: status,
            statusText: connection.getResponseMessage(),
            headers,
            data
        })
    }

}