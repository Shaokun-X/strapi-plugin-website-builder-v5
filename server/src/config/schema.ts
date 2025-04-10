// import yup from 'yup';
const yup = require('yup');

export const pluginConfigSchema = yup
  .object({
    shared: yup.object(),
    hooks: yup.object(),
    builds: yup.array().of(
      yup.object({
        enabled: yup.bool(),
        name: yup.string().required('A build name must be provided'),
        url: yup.string().required('A URL is required'),
        trigger: yup
          .object({
            type: yup
              .string()
              .oneOf(['manual', 'cron', 'event'])
              .required('A trigger type is required'),
            expression: yup.lazy((_value, { parent }) => {
              return parent?.type === 'cron'
                ? yup.string().required('A cron expression must be entered')
                : yup.string().notRequired();
            }),
            events: yup.lazy((_value, { parent }) => {
              if (parent?.type === 'event') {
                return yup
                  .array()
                  .of(
                    yup.object({
                      uid: yup.string().required('A uid is required'),
                      actions: yup.mixed().test({
                        name: 'actions',
                        exclusive: true,
                        message: '${path} must be a string or valid actions',
                        test: async (value) => {
                          if (typeof value === 'string') return true;

                          const isValid = await yup
                            .array()
                            .of(
                              yup
                                .string()
                                .oneOf(['create', 'update', 'delete', 'publish', 'unpublish'])
                            )
                            .required('uid actions are required')
                            .isValid(value);

                          return isValid;
                        },
                      }),
                    })
                  )
                  .min(1, 'At least one event must be provided')
                  .required('events is required');
              } else {
                return yup.mixed().notRequired();
              }
            }),
          })
          .required('A trigger is required'),
        method: yup.mixed().oneOf(['GET', 'POST']).optional(),
        params: yup.mixed().test({
          name: 'params',
          exclusive: true,
          message: '${path} must be an object or function',
          test: async (value) => typeof value === 'function' || (await yup.object().isValid(value)),
        }),
        headers: yup.mixed().test({
          name: 'headers',
          exclusive: true,
          message: '${path} must be an object or function',
          test: async (value) => typeof value === 'function' || (await yup.object().isValid(value)),
        }),
        body: yup.mixed().test({
          name: 'body',
          exclusive: true,
          message: '${path} must be an object or function',
          test: async (value) => typeof value === 'function' || (await yup.object().isValid(value)),
        }),
      })
    ),
  })
  .required('A config is required');
