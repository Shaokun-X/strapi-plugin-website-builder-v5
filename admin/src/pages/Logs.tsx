/*
 *
 * LogsPage
 *
 */
// @ts-nocheck
import { memo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import {
  Main,
  Box,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  EmptyStateLayout,
  Typography,
  VisuallyHidden,
  Button,
} from '@strapi/design-system';
import { FileError, Trash } from '@strapi/icons';
import { Page, Layouts } from '@strapi/strapi/admin';
import { useLogs } from '../hooks/useLogs';
import { getTranslation } from '../utils/getTranslation';

const LogsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  // TODO fix type
  const [logs, setLogs] = useState<any[]>([]);
  const { formatMessage } = useIntl();
  const { getLogs, deleteLog } = useLogs();

  const {
    isLoading: isLoadingLogs,
    data: response,
    isRefetching: isRefetchingLogs,
  } = getLogs({ page: 1 });

  useEffect(() => {
    setIsLoading(true);
    if (!isLoadingLogs && !isRefetchingLogs) {
      if (response && !response.error) {
        setLogs(response.data);
      }
      setIsLoading(false);
    }
  }, [isLoadingLogs, isRefetchingLogs]);

  // TODO fix type
  function isSuccessStatus(status: any) {
    return status >= 200 && 400 > status;
  }

  // TODO fix type
  function handleLogDelete(id: any) {
    deleteLog(id);
  }

  return (
    <Layouts.Root>
      <Main aria-busy={isLoading}>
        <Layouts.Header
          title={formatMessage({
            id: getTranslation('logs.header.title'),
            defaultMessage: 'Build Logs',
          })}
        />
        <Layouts.Content>
          {isLoading ? (
            <Box background="neutral0" padding={6} shadow="filterShadow" hasRadius>
              <Page.Loading />
            </Box>
          ) : logs.length > 0 ? (
            <>
              <Table colCount={5} rowCount={logs.length + 1}>
                <Thead>
                  <Tr>
                    <Th>
                      <Typography variant="sigma" textColor="neutral600">
                        {formatMessage({
                          id: getTranslation('logs.table.header.id'),
                          defaultMessage: 'ID',
                        })}
                      </Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma" textColor="neutral600">
                        {formatMessage({
                          id: getTranslation('logs.table.header.build'),
                          defaultMessage: 'Build',
                        })}
                      </Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma" textColor="neutral600">
                        {formatMessage({
                          id: getTranslation('logs.table.header.trigger'),
                          defaultMessage: 'Trigger',
                        })}
                      </Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma" textColor="neutral600">
                        {formatMessage({
                          id: getTranslation('logs.table.header.status'),
                          defaultMessage: 'Status',
                        })}
                      </Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma" fontWeight="semiBold" textColor="neutral600">
                        {formatMessage({
                          id: getTranslation('logs.table.header.timestamp'),
                          defaultMessage: 'Timestamp',
                        })}
                      </Typography>
                    </Th>
                    <Th>
                      <VisuallyHidden>
                        {formatMessage({
                          id: getTranslation('table.header.actions'),
                          defaultMessage: 'Actions',
                        })}
                      </VisuallyHidden>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {logs.map((log) => (
                    // TODO pagination
                    <Tr key={log.id}>
                      <Td>
                        <Typography textColor="neutral800">{log.id}</Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">{log.trigger}</Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">{log.build || 'unknown'}</Typography>
                      </Td>
                      <Td>
                        <Typography
                          fontWeight="semiBold"
                          textColor={isSuccessStatus(log.status) ? 'success500' : 'danger500'}
                        >
                          {log.status}
                        </Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">{log.createdAt}</Typography>
                      </Td>
                      <Td>
                        {/* TODO fix delete */}
                        <Button onClick={() => handleLogDelete(log.id)}>Delete</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          ) : (
            <EmptyStateLayout
              icon={<FileError width="160px" />}
              content={formatMessage({
                id: getTranslation('logs.empty'),
                defaultMessage: 'No logs found',
              })}
            />
          )}
        </Layouts.Content>
      </Main>
    </Layouts.Root>
  );
};

export default LogsPage;
