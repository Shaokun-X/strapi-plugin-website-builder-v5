import type { Core } from '@strapi/strapi';
import { getService } from '../utils';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Trigger a website build
   *
   * @return {Object}
   */
  async trigger(ctx) {
    try {
      const { status } = await getService({ strapi, name: 'build' }).trigger({
        name: ctx.request.body.data.name,
        trigger: { type: 'manual' },
      });

      ctx.send({ data: { status } });
    } catch (error) {
      ctx.badRequest();
    }
  },

  /**
   * Get all builds
   *
   * @return {Object}
   */
  async find(ctx) {
    ctx.send({ data: getService({ strapi, name: 'settings' }).get({ path: 'builds' }) });
  },
});

export default controller;
