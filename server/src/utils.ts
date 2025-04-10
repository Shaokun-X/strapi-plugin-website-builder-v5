import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from './constants';

export function getService({
  strapi,
  name,
  plugin = PLUGIN_ID,
}: {
  strapi: Core.Strapi;
  name: string;
  plugin?: string;
}) {
  return strapi.plugin(plugin).service(name);
}

export async function resolveValue({ value, args }) {
  if (typeof value === 'function') {
    return await value(args);
  }

  return value;
}
