import { useMutation, useQuery } from 'react-query';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';

import { PLUGIN_ID } from '../pluginId';
import { getTranslation } from '../utils/getTranslation';
import { useIntl } from 'react-intl';
import { useState } from 'react';

export const useBuild = () => {
  const { post, get } = useFetchClient();
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const [ isTriggering, setIsTriggering ] = useState(false);

  function getBuilds() {
    return useQuery({
      queryKey: [PLUGIN_ID, 'builds'],
      queryFn: function () {
        return get(`/${PLUGIN_ID}/builds`);
      },
      select: function ({ data }) {
        return data.data || false;
      },
      refetchOnWindowFocus: false,
    });
  }

  const { mutateAsync: triggerBuild } = useMutation({
    // TODO fix type
    mutationFn: async function (data: any) {
      setIsTriggering(true);
      return await post(`/${PLUGIN_ID}/builds`, { data });
    },
    onSuccess: () => {
      toggleNotification({
        type: 'success',
        message: formatMessage({ id: getTranslation('build.notification.trigger.success') }),
      });
    },
    onError: (error: any) => {
      toggleNotification({
        type: 'danger',
        message:
          error.response?.error?.message ||
          error.message ||
          formatMessage({ id: 'notification.error' }),
      });
    },
    onSettled: () => {
      setIsTriggering(false);
    },
  });

  return {
    triggerBuild,
    isTriggering,
    getBuilds,
  };
};
