
import root from '../root.svelte';
import { set_building } from '__sveltekit/environment';
import { set_assets } from '__sveltekit/paths';
import { set_private_env, set_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	track_server_fetches: false,
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: true,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf8\" />\n    <meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n    <link rel=\"shortcut icon\" href=\"/icons/favicon-196x196.png\" />\n    <link rel=\"apple-touch-icon\" href=\"/icons/apple-touch-icon-152x152.png\" />\n    <link\n      rel=\"alternate\"\n      type=\"application/rss+xml\"\n      title=\"Upvotocracy.com RSS Feed\"\n      href=\"https://upvotocracy.com/api/1/posts/rss?sort=-created\"\n    />\n\n    " + head + "\n\n    <link rel=\"stylesheet\" href=\"global.css\" />\n    <link rel=\"manifest\" href=\"manifest.json\" crossorigin=\"use-credentials\" />\n    <link rel=\"icon\" type=\"image/png\" href=\"/icons/favicon-196x196.png\" />\n\n    <meta name=\"apple-mobile-web-app-title\" content=\"Upvotocracy\" />\n    <meta property=\"og:site_name\" content=\"upvotocracy.com\" />\n    <meta name=\"twitter:site\" content=\"@chovy\" />\n\n    <script\n      src=\"https://cdnjs.cloudflare.com/ajax/libs/plyr/3.5.10/plyr.min.js\"\n      integrity=\"sha256-PZ39kLf9/dLC2dBi9oCbWLVi4Qj5+DpuC78IiCcHkGo=\"\n      crossorigin=\"anonymous\"\n    ></script>\n    <script src=\"https://cdn.rawgit.com/video-dev/hls.js/18bb552/dist/hls.min.js\"></script>\n  </head>\n  <body>\n\t\t<div style=\"display: contents\">" + body + "</div>\n  </body>\n</html>\n",
		error: ({ status, message }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,\n\t\t\t\t\tUbuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "2ucv6a"
};

export function get_hooks() {
	return {};
}

export { set_assets, set_building, set_private_env, set_public_env };
