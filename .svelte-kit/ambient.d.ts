
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const HOST_USER: string;
	export const HOST_DOMAIN: string;
	export const HOST_PATH: string;
	export const HOST_PROJECT: string;
	export const PORT: string;
	export const API_BASE_URL: string;
	export const BASE_URL: string;
	export const COST_SPONSORED_POST: string;
	export const GOOGLE_ANALYTICS: string;
	export const MATOMO_URL: string;
	export const MATOMO_ID: string;
	export const SITE_NAME: string;
	export const SITE_DOMAIN: string;
	export const SITE_URL: string;
	export const SITE_EMAIL: string;
	export const SITE_EMAIL_SUBJECT: string;
	export const SITE_DESCRIPTION: string;
	export const COMPOSE_PROJECT_NAME: string;
	export const MAX_UPLOAD_SIZE: string;
	export const MOBILE_BREAK_POINT: string;
	export const MOBILE_BREAK_POINT_PX: string;
	export const SHELL: string;
	export const npm_command: string;
	export const LSCOLORS: string;
	export const SESSION_MANAGER: string;
	export const npm_config_userconfig: string;
	export const QT_SCREEN_SCALE_FACTORS: string;
	export const COLORTERM: string;
	export const XDG_CONFIG_DIRS: string;
	export const npm_config_cache: string;
	export const LESS: string;
	export const XDG_SESSION_PATH: string;
	export const NVM_INC: string;
	export const TERM_PROGRAM_VERSION: string;
	export const NODE: string;
	export const LC_ADDRESS: string;
	export const LC_NAME: string;
	export const COLOR: string;
	export const npm_config_local_prefix: string;
	export const DESKTOP_SESSION: string;
	export const LC_MONETARY: string;
	export const GTK_RC_FILES: string;
	export const NO_AT_BRIDGE: string;
	export const npm_config_globalconfig: string;
	export const XCURSOR_SIZE: string;
	export const CLOUDSDK_PYTHON_ARGS: string;
	export const EDITOR: string;
	export const GTK_MODULES: string;
	export const XDG_SEAT: string;
	export const PWD: string;
	export const XDG_SESSION_DESKTOP: string;
	export const LOGNAME: string;
	export const XDG_SESSION_TYPE: string;
	export const npm_config_init_module: string;
	export const SYSTEMD_EXEC_PID: string;
	export const _: string;
	export const XAUTHORITY: string;
	export const MOTD_SHOWN: string;
	export const GTK2_RC_FILES: string;
	export const HOME: string;
	export const LC_PAPER: string;
	export const LANG: string;
	export const LS_COLORS: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const npm_package_version: string;
	export const CLOUDSDK_ROOT_DIR: string;
	export const DENO_INSTALL: string;
	export const XDG_SEAT_PATH: string;
	export const INVOCATION_ID: string;
	export const MANAGERPID: string;
	export const PROMPT: string;
	export const INIT_CWD: string;
	export const CHROME_DESKTOP: string;
	export const KDE_SESSION_UID: string;
	export const npm_lifecycle_script: string;
	export const CLOUDSDK_PYTHON: string;
	export const NVM_DIR: string;
	export const GEM_HOME: string;
	export const XDG_SESSION_CLASS: string;
	export const TERM: string;
	export const LC_IDENTIFICATION: string;
	export const npm_package_name: string;
	export const ZSH: string;
	export const npm_config_prefix: string;
	export const GOOGLE_CLOUD_SDK_HOME: string;
	export const USER: string;
	export const KDE_SESSION_VERSION: string;
	export const PAM_KWALLET5_LOGIN: string;
	export const DISPLAY: string;
	export const npm_lifecycle_event: string;
	export const SHLVL: string;
	export const NVM_CD_FLAGS: string;
	export const PAGER: string;
	export const LC_TELEPHONE: string;
	export const LC_MEASUREMENT: string;
	export const XDG_VTNR: string;
	export const XDG_SESSION_ID: string;
	export const QT_LINUX_ACCESSIBILITY_ALWAYS_ON: string;
	export const npm_config_user_agent: string;
	export const npm_execpath: string;
	export const XDG_RUNTIME_DIR: string;
	export const DEBUGINFOD_URLS: string;
	export const npm_package_json: string;
	export const LC_TIME: string;
	export const QT_AUTO_SCREEN_SCALE_FACTOR: string;
	export const JOURNAL_STREAM: string;
	export const XCURSOR_THEME: string;
	export const GTK3_MODULES: string;
	export const XDG_DATA_DIRS: string;
	export const GDK_BACKEND: string;
	export const KDE_FULL_SESSION: string;
	export const npm_config_noproxy: string;
	export const PATH: string;
	export const npm_config_metrics_registry: string;
	export const npm_config_node_gyp: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const npm_config_global_prefix: string;
	export const KDE_APPLICATIONS_AS_SCOPE: string;
	export const NVM_BIN: string;
	export const MAIL: string;
	export const npm_node_execpath: string;
	export const LC_NUMERIC: string;
	export const OLDPWD: string;
	export const TERM_PROGRAM: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		HOST_USER: string;
		HOST_DOMAIN: string;
		HOST_PATH: string;
		HOST_PROJECT: string;
		PORT: string;
		API_BASE_URL: string;
		BASE_URL: string;
		COST_SPONSORED_POST: string;
		GOOGLE_ANALYTICS: string;
		MATOMO_URL: string;
		MATOMO_ID: string;
		SITE_NAME: string;
		SITE_DOMAIN: string;
		SITE_URL: string;
		SITE_EMAIL: string;
		SITE_EMAIL_SUBJECT: string;
		SITE_DESCRIPTION: string;
		COMPOSE_PROJECT_NAME: string;
		MAX_UPLOAD_SIZE: string;
		MOBILE_BREAK_POINT: string;
		MOBILE_BREAK_POINT_PX: string;
		SHELL: string;
		npm_command: string;
		LSCOLORS: string;
		SESSION_MANAGER: string;
		npm_config_userconfig: string;
		QT_SCREEN_SCALE_FACTORS: string;
		COLORTERM: string;
		XDG_CONFIG_DIRS: string;
		npm_config_cache: string;
		LESS: string;
		XDG_SESSION_PATH: string;
		NVM_INC: string;
		TERM_PROGRAM_VERSION: string;
		NODE: string;
		LC_ADDRESS: string;
		LC_NAME: string;
		COLOR: string;
		npm_config_local_prefix: string;
		DESKTOP_SESSION: string;
		LC_MONETARY: string;
		GTK_RC_FILES: string;
		NO_AT_BRIDGE: string;
		npm_config_globalconfig: string;
		XCURSOR_SIZE: string;
		CLOUDSDK_PYTHON_ARGS: string;
		EDITOR: string;
		GTK_MODULES: string;
		XDG_SEAT: string;
		PWD: string;
		XDG_SESSION_DESKTOP: string;
		LOGNAME: string;
		XDG_SESSION_TYPE: string;
		npm_config_init_module: string;
		SYSTEMD_EXEC_PID: string;
		_: string;
		XAUTHORITY: string;
		MOTD_SHOWN: string;
		GTK2_RC_FILES: string;
		HOME: string;
		LC_PAPER: string;
		LANG: string;
		LS_COLORS: string;
		XDG_CURRENT_DESKTOP: string;
		npm_package_version: string;
		CLOUDSDK_ROOT_DIR: string;
		DENO_INSTALL: string;
		XDG_SEAT_PATH: string;
		INVOCATION_ID: string;
		MANAGERPID: string;
		PROMPT: string;
		INIT_CWD: string;
		CHROME_DESKTOP: string;
		KDE_SESSION_UID: string;
		npm_lifecycle_script: string;
		CLOUDSDK_PYTHON: string;
		NVM_DIR: string;
		GEM_HOME: string;
		XDG_SESSION_CLASS: string;
		TERM: string;
		LC_IDENTIFICATION: string;
		npm_package_name: string;
		ZSH: string;
		npm_config_prefix: string;
		GOOGLE_CLOUD_SDK_HOME: string;
		USER: string;
		KDE_SESSION_VERSION: string;
		PAM_KWALLET5_LOGIN: string;
		DISPLAY: string;
		npm_lifecycle_event: string;
		SHLVL: string;
		NVM_CD_FLAGS: string;
		PAGER: string;
		LC_TELEPHONE: string;
		LC_MEASUREMENT: string;
		XDG_VTNR: string;
		XDG_SESSION_ID: string;
		QT_LINUX_ACCESSIBILITY_ALWAYS_ON: string;
		npm_config_user_agent: string;
		npm_execpath: string;
		XDG_RUNTIME_DIR: string;
		DEBUGINFOD_URLS: string;
		npm_package_json: string;
		LC_TIME: string;
		QT_AUTO_SCREEN_SCALE_FACTOR: string;
		JOURNAL_STREAM: string;
		XCURSOR_THEME: string;
		GTK3_MODULES: string;
		XDG_DATA_DIRS: string;
		GDK_BACKEND: string;
		KDE_FULL_SESSION: string;
		npm_config_noproxy: string;
		PATH: string;
		npm_config_metrics_registry: string;
		npm_config_node_gyp: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		npm_config_global_prefix: string;
		KDE_APPLICATIONS_AS_SCOPE: string;
		NVM_BIN: string;
		MAIL: string;
		npm_node_execpath: string;
		LC_NUMERIC: string;
		OLDPWD: string;
		TERM_PROGRAM: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
