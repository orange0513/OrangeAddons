let socketFactory
let acceptedContentEncoding = ["gzip", "deflate"]

function loadHttpFix() {
    const HTTPUrlConnection = Java.type("java.net.HttpURLConnection")
    let methodsField = HTTPUrlConnection.class.getDeclaredField("methods")
    methodsField.setAccessible(true)
    const Field = Java.type("java.lang.reflect.Field")
    let modifiersField = Field.class.getDeclaredField("modifiers")
    modifiersField.setAccessible(true)
    const Modifier = Java.type("java.lang.reflect.Modifier")
    modifiersField.setInt(methodsField, methodsField.getModifiers() & ~Modifier.FINAL)
    const JavaArray = Java.type("java.lang.reflect.Array")
    const methods = JavaArray.newInstance(java.lang.String, methodsField.get(HTTPUrlConnection).length + 1)
    for (let i = 0; i < methods.length; i++) {
        methods[i] = ["GET", "POST", "HEAD", "OPTIONS", "PUT", "DELETE", "TRACE", "PATCH"][i]
    }
    methodsField.set(null, methods)
}

function loadCertificates() {
    let certificates = ["ISRGRootX1.cer"]
    const KeyStore = Java.type("java.security.KeyStore"),
        Paths = Java.type("java.nio.file.Paths"),
        System = Java.type("java.lang.System"),
        Files = Java.type("java.nio.file.Files"),
        CertificateFactory = Java.type("java.security.cert.CertificateFactory"),
        JavaString = Java.type("java.lang.String"),
        ByteArrayInputStream = Java.type("java.io.ByteArrayInputStream"),
        TrustManagerFactory = Java.type("javax.net.ssl.TrustManagerFactory"),
        SSLContext = Java.type("javax.net.ssl.SSLContext")
    let keyStore = KeyStore.getInstance(KeyStore.getDefaultType())
    let ksPath = Paths.get(System.getProperty("java.home"), "lib", "security", "cacerts")
    keyStore.load(Files.newInputStream(ksPath), new JavaString("changeit").toCharArray())
    let cf = CertificateFactory.getInstance("X.509")
    for (let i of certificates) {
        let pathStr = `${Config.modulesFolder}/axios/src/certificates/${i}`
        let path = Paths.get(pathStr)
        let data = Files.readAllBytes(path)
        let cert = cf.generateCertificate(new ByteArrayInputStream(data))
        keyStore.setCertificateEntry("dev.semisol.letsencryptsupport:" + i, cert)
    }
    let tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm())
    tmf.init(keyStore)
    let sslContext = SSLContext.getInstance("TLS")
    sslContext.init(null, tmf.getTrustManagers(), null)
    SSLContext.setDefault(sslContext)
    socketFactory = sslContext.getSocketFactory()
}

function loadHttpCookieManager() {
    const CookieManager = Java.type("java.net.CookieManager")
    const CookiePolicy = Java.type("java.net.CookiePolicy")
    const CookieHandler = Java.type("java.net.CookieHandler")
    const cookieManager = new CookieManager()
    CookieHandler.setDefault(cookieManager)
    cookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ORIGINAL_SERVER)
}

function checkDependencies() {
    const BrotliInputStream = Java.type("org.brotli.dec.BrotliInputStream")
    if (typeof BrotliInputStream === "function") {
        acceptedContentEncoding.push("br")
    }
}

loadHttpFix()
loadCertificates()
loadHttpCookieManager()
checkDependencies()

export { socketFactory, acceptedContentEncoding }
