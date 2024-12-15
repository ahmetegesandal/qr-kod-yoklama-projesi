// lib/cors.js
export function cors(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Tüm domainlere izin verir. Güvenlik için bunu değiştirebilirsiniz.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

    // Preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
}
