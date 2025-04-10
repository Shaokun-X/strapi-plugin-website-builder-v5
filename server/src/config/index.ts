import { pluginConfigSchema } from './schema';

export default {
  default: {},
  validator: async (config) => await pluginConfigSchema.validate(config),
};
