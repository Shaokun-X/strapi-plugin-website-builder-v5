import { useMutation, useQuery } from 'react-query';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';

import { PLUGIN_ID } from '../pluginId';
import { getTranslation } from '../utils/getTranslation';
import { useIntl } from 'react-intl';

export const useBuild = () => {
  const { post, get } = useFetchClient();
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();

  function getBuilds() {
    return useQuery({
      queryKey: [PLUGIN_ID, 'builds'],
      queryFn: function () {
        return get(`/${PLUGIN_ID}/builds`);
      },
      select: function ({ data }) {
        return data.data || false;
      },
    });
  }

  const { mutateAsync: triggerBuild } = useMutation({
    // TODO fix type
    mutationFn: function (data: any) {
      return post(`/${PLUGIN_ID}/builds`, { data });
    },
    onSuccess: () => {
      toggleNotification({
        type: 'success',
        message: formatMessage({ id: getTranslation('build.notification.trigger.success') }),
      });
    },
    onError: (error: any) => {
      toggleNotification({
        type: 'warning',
        message:
          error.response?.error?.message ||
          error.message ||
          formatMessage({ id: 'notification.error' }),
      });
    },
  });

  return {
    triggerBuild,
    getBuilds,
  };
};
