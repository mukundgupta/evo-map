import adapter from '@sveltejs/adapter-static';

const isDev = process.env.NODE_ENV === 'development';

export default {
	kit: {
		adapter: adapter(),
		paths: {
			base: isDev ? '' : '/evo-map'
		}
	}
};