export function stringifyQuery(query) {
    let queryString = ""
    for (let key in query) {
        if (queryString !== "") {
            queryString += "&"
        }
        queryString += encodeURIComponent(key) + "=" + encodeURIComponent(query[key])
    }
    return queryString
}

export function parseOptions(options) {
    options.method = options.method?.toUpperCase()?.trim() ?? "GET"
    options.timeout = options.timeout ?? 0
    options.connectTimeout = options.connectTimeout ?? options.timeout
    options.readTimeout = options.readTimeout ?? options.timeout
    options.query = options.query ?? {}
    options.followRedirect = options.followRedirect ?? true
    options.parseBody = options.parseBody ?? true
    options.bodyParser = options.parser ?? JSON.parse
    options.parseHeaders = options.parseHeaders ?? true
    options.headersParser = options.headersParser ?? JSON.parse
    options.useDefaultUserAgent = options.useDefaultUserAgent ?? true
    options.validateStatus = options.validateStatus ?? (status => status < 299)

    if (options.json === true) {
        options.parseBody = true
        options.parser = JSON.parse
        console.warn("axios: json option is deprecated, use parseBody instead")
    } else if (options.json === false) {
        options.parseBody = false
        console.warn("axios: json option is deprecated, use parseBody instead")
    }

    let headers = options.headers ?? {}
    options.headers = new Map()
    for (let key in headers) {
        options.headers.set(key.toLowerCase(), headers[key])
    }

    if (options.useDefaultUserAgent && !options.headers.get("user-agent")) {
        options.headers.set("user-agent", `axios/${JSON.parse(FileLib.read(Config.modulesFolder + "/axios/metadata.json")).version} (ChatTriggers)`)
    }

    return options
}
