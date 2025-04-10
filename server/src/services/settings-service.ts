import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../constants';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  get({ path, defaultValue }: { path: string; defaultValue?: any } = { path: '' }) {
    if (path.length) {
      path = `.${path}`;
    }
    return strapi.config.get(`plugin::${PLUGIN_ID}${path}`, defaultValue);
  },
  set({ path = '', value }) {
    return strapi.config.set(`plugin::${PLUGIN_ID}${path}`, value);
  },
});
