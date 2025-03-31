import withPWA from 'next-pwa';
import TerserPlugin from 'terser-webpack-plugin';

const pwaNextConfig = withPWA({
    dest: "public",
    disable: true,
    register: true,
    skipWaiting: true,
});
//

const nextConfig = {    
    async headers() {
        return [
            {
                source: "/(.*)", // Apply these headers to all routes
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "no-referrer",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    {   key: "Cross-Origin-Opener-Policy", 
                        value: "same-origin" 
                    },
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Methods", value: process.env.NEXT_PUBLIC_ALLOWED_METHODS!},
                    { key: "Access-Control-Allow-Headers", value: process.env.NEXT_PUBLIC_ALLOWED_HEADERS!}
                ],
            },
        ];
    },
webpack: (config: any) => { 
    config.resolve.fallback = { 
        ...config.resolve.fallback, 
        stream: "stream-browserify", 
        util: "util/", 
    }; 

        config.optimization = { 
            minimize: true, 
            minimizer: [ 
                new TerserPlugin({ 
            terserOptions: { 
                compress: { drop_console: true, }, 
        }, }), 
    ], };
        return config; 
}, 
};


export default pwaNextConfig(nextConfig);