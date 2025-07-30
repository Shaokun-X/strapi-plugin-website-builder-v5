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

      switch (status) {
        case 200:
          ctx.send({ data: { status }, message: 'Build triggered successfully.' });
          break;

        case 201:
          ctx.created({ data: { status }, message: 'Build created and triggered.' });
          break;

        case 204:
          ctx.status = 204;
          ctx.body = null;
          break;

        case 400:
          ctx.badRequest('Invalid trigger request.');
          break;

        case 401:
        case 403:
          ctx.unauthorized('You are not authorized to trigger this build.');
          break;

        case 404:
          ctx.notFound('Build not found.');
          break;

        default:
          ctx.send({ data: { status }, message: 'Unhandled status code' });
      }
    } catch (error) {
      ctx.internalServerError('An unexpected error occurred, please check the logs.');
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
