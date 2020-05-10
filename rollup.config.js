import { config as envConfig } from 'dotenv-flow'
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';

envConfig({
	purge_dotenv: true
});

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
				API_BASE_URL: process.env.API_BASE_URL,
				BASE_URL: process.env.BASE_URL,
				STRIPE_API_KEY: process.env.STRIPE_API_KEY,
				COST_SPONSORED_POST: process.env.COST_SPONSORED_POST,
				GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
				SITE_NAME: process.env.SITE_NAME,
				SITE_URL: process.env.SITE_URL,
				SITE_DOMAIN: process.env.SITE_DOMAIN,
				SITE_DESCRIPTON: process.env.SITE_DESCRIPTION,
				SITE_EMAIL: process.env.SITE_EMAIL,
				SITE_EMAIL_SUBJECT: process.env.SITE_EMAIL_SUBJECT,
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				runtimeHelpers: true,
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode),
				API_BASE_URL: process.env.API_BASE_URL,
				BASE_URL: process.env.BASE_URL,
				COST_SPONSORED_POST: process.env.COST_SPONSORED_POST,
				GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
				SITE_NAME: process.env.SITE_NAME,
				SITE_DOMAIN: process.env.SITE_DOMAIN,
				SITE_DESCRIPTON: process.env.SITE_DESCRIPTION,
				SITE_EMAIL: process.env.SITE_EMAIL,
				SITE_EMAIL_SUBJECT: process.env.SITE_EMAIL_SUBJECT,
			}),
			svelte({
				generate: 'ssr',
				dev
			}),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),

		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
				API_BASE_URL: process.env.API_BASE_URL,
				BASE_URL: process.env.BASE_URL,
				COST_SPONSORED_POST: process.env.COST_SPONSORED_POST,
				GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
				SITE_NAME: process.env.SITE_NAME,
				SITE_DOMAIN: process.env.SITE_DOMAIN,
				SITE_DESCRIPTON: process.env.SITE_DESCRIPTION,
				SITE_EMAIL: process.env.SITE_EMAIL,
				SITE_EMAIL_SUBJECT: process.env.SITE_EMAIL_SUBJECT,
			}),
			commonjs(),
			!dev && terser()
		],

		onwarn,
	}
};
