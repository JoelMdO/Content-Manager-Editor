(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root of the server]__10e38381._.js", {

"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[project]/src/services/api/rate_limit.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "default": (()=>rateLimit)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [middleware-edge] (ecmascript)");
;
;
const duration = Number(("TURBOPACK compile-time value", "1"));
const limit = Number(("TURBOPACK compile-time value", "4"));
const req = new Map();
async function rateLimit(request) {
    let ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || "unknown";
    let pathname = new URL(request.url).pathname;
    const currentTime = Date.now();
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    const key = `${ip}:${pathname}`; // Different key for each endpoint
    try {
        if (!req.has(key)) {
            req.set(key, {
                count: 1,
                lastRequest: currentTime
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        } else {
            const { count, lastRequest } = req.get(key);
            if (currentTime - lastRequest > duration * 60 * 1000) {
                req.set(key, {
                    count: 1,
                    lastRequest: currentTime
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
            } else if (count >= limit) {
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify({
                    error: 'Too many requests. Please try again later.'
                }), {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                req.set(key, {
                    count: count + 1,
                    lastRequest: currentTime
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
            }
        }
    } catch (error) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify({
            error: 'Firebase initialization failed'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
const config = {
    matcher: [
        '/api/:path*'
    ]
};
}}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2f$rate_limit$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api/rate_limit.ts [middleware-edge] (ecmascript)");
;
;
async function middleware(req) {
    ///----------------------------------------------------------------
    // Check in case of subrequest
    ///----------------------------------------------------------------
    const path = req.nextUrl.pathname;
    let rateLimitResponse;
    let response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    const database_url = process.env.NEXT_PUBLIC_databaseURL;
    if (path.startsWith('/dashboard') || path.startsWith('/playbook') || path.startsWith('/read-playbook')) {
        //Get the previous path
        const referrer = req.headers.get("referer") || "";
        const referrerUrl = referrer ? new URL(referrer) : null;
        const referrerPAth = referrerUrl?.pathname || "";
        if (referrerPAth === '/') {
            rateLimitResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2f$rate_limit$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])(req);
            if (rateLimitResponse.status === 200) {
                return response;
            } else {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/', req.url));
            }
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/', req.url));
        }
    }
    //
    const header = req.headers;
    const isSubRequest = header.get('x-middleware-subrequest');
    if (isSubRequest) {
        const origin = header.get('origin') || header.get('referer');
        const url = process.env.NEXT_PUBLIC_api_url;
        if (!origin || origin != url) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: 403,
                error: 'Unauthorized request'
            });
        }
    }
    ///----------------------------------------------------------------
    ///------ Check for any rate limits on other paths ----------------
    ///----------------------------------------------------------------
    //Apply rate Limit.
    rateLimitResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2f$rate_limit$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])(req);
    ///----------------------------------------------------------------
    ///------ Add headers ----------------
    ///----------------------------------------------------------------
    response.headers.set('Content-Security-Policy', `
      default-src 'self';
      script-src 'self';
      style-src 'self';
      img-src 'self';
      font-src 'self';
      connect-src 'self' ${database_url};
      object-src 'none';
      base-uri 'self';
      form-action 'self';            
      frame-ancestors 'self';
      upgrade-insecure-requests;
      block-all-mixed-content;
      `.replace(/\s{2,}/g, ' ').trim());
    return response;
}
const config = {
    matcher: [
        '/api/post',
        '/dashboard',
        '/playbook',
        '/read-playbook'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__10e38381._.js.map