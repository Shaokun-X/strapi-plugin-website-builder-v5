import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';

import { PLUGIN_ID } from '../pluginId';
import { getTranslation } from '../utils/getTranslation';
import { useIntl } from 'react-intl';

export const useLogs = () => {
  const { get, del } = useFetchClient();
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();

  // TODO fix type
  function getLogs({ page }: { page: any }) {
    return useQuery({
      queryKey: [PLUGIN_ID, 'logs'],
      queryFn: function () {
        return get(`/${PLUGIN_ID}/logs`, {
          params: { sort: ['id:desc'], pagination: { page, pageSize: 10 } },
        });
      },
      select: function ({ data }) {
        return data ? { ...data } : false;
      },
      refetchOnWindowFocus: false,
    });
  }

  const { mutateAsync: deleteLog } = useMutation({
    mutationFn: function (id) {
      return del(`/${PLUGIN_ID}/logs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([PLUGIN_ID, 'logs']);
      toggleNotification({
        type: 'success',
        message: formatMessage({ id: getTranslation('log.notification.delete.success') }),
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
    getLogs,
    deleteLog,
  };
};
