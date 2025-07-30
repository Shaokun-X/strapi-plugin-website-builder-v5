import type { Core } from '@strapi/strapi';
import { getService } from '../utils';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async trigger({ name, record, trigger }) {
    const log = { trigger: trigger.type, status: 500, build: name, response: null, method: 'POST' };

    try {
      const request = await getService({ strapi, name: 'request' }).build({
        name,
        record,
        trigger,
      });
      const response = await getService({ strapi, name: 'request' }).execute(request);
      log.status = response.status;
      log.response = response.data;
    } catch (error) {
      if (error.response) {
        log.status = error.response.status;
        log.response = error.response.data;
      } else if (error.request) {
        log.response = {};
      } else {
        log.response = error.message;
      }
    }

    getService({ strapi, name: 'log' }).create({ data: log });

    return { status: log.status };
  },
});
