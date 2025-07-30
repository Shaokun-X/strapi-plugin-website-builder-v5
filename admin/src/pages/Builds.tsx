/*
 *
 * BuildPage
 *
 */
import { memo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
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
  Checkbox,
  LinkButton,
  Button,
  Flex,
} from '@strapi/design-system';
import { FileError, Clock, Play } from '@strapi/icons';
import { PLUGIN_ID } from '../pluginId';
import { Page, Layouts } from '@strapi/strapi/admin';
import { useBuild } from '../hooks/useBuild';
import { getTranslation } from '../utils/getTranslation';

const BuildPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  // TODO fix type
  const [builds, setBuilds] = useState<any[]>([]);
  const { formatMessage } = useIntl();
  const { triggerBuild, isTriggering, getBuilds } = useBuild();

  const { isLoading: isLoadingBuilds, data, isRefetching: isRefetchingBuilds } = getBuilds();

  useEffect(() => {
    setIsLoading(true);
    if (!isLoadingBuilds && !isRefetchingBuilds) {
      if (data) {
        setBuilds(data);
      }
      setIsLoading(false);
    }
  }, [isLoadingBuilds, isRefetchingBuilds]);

  // TODO fix type
  function handleTriggerBuild(name: any) {
    triggerBuild({ name });
  }

  return (
    <Layouts.Root>
      <Main aria-busy={isLoading}>
        <Layouts.Header
          title={formatMessage({
            id: getTranslation('builds.header.title'),
            defaultMessage: 'Builds',
          })}
          primaryAction={
            <LinkButton
              tag={Link}
              variant="secondary"
              size="s"
              endIcon={<Clock />}
              to={`/plugins/${PLUGIN_ID}/logs`}
            >
              Logs
            </LinkButton>
          }
        />
        <Layouts.Content>
          {isLoading ? (
            <Box background="neutral0" padding={6} shadow="filterShadow" hasRadius>
              <Page.Loading />
            </Box>
          ) : builds.length > 0 ? (
            <Table colCount={5} rowCount={builds.length + 1}>
              <Thead>
                <Tr>
                  <Th width="5%">
                    <Typography variant="sigma" textColor="neutral600">
                      {formatMessage({
                        id: getTranslation('builds.table.header.enabled'),
                        defaultMessage: 'Enabled',
                      })}
                    </Typography>
                  </Th>
                  <Th width="5%">
                    <Typography variant="sigma" textColor="neutral600">
                      {formatMessage({
                        id: getTranslation('builds.table.header.trigger'),
                        defaultMessage: 'Trigger',
                      })}
                    </Typography>
                  </Th>
                  <Th width="20%">
                    <Typography variant="sigma" textColor="neutral600">
                      {formatMessage({
                        id: getTranslation('builds.table.header.name'),
                        defaultMessage: 'Name',
                      })}
                    </Typography>
                  </Th>
                  <Th width="60%">
                    <Typography variant="sigma" textColor="neutral600">
                      {formatMessage({
                        id: getTranslation('builds.table.header.url'),
                        defaultMessage: 'URL',
                      })}
                    </Typography>
                  </Th>
                  <Th width="10%">
                    {formatMessage({
                      id: getTranslation('table.header.actions'),
                      defaultMessage: 'Actions',
                    })}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {builds.map((build) => (
                  <Tr key={btoa(build.name)}>
                    <Td>
                      <Checkbox disabled={true} checked={build.enabled} />
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{build.trigger.type}</Typography>
                    </Td>
                    <Td>
                      <Typography fontWeight="semiBold" textColor="neutral800">
                        {build.name}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{build.url}</Typography>
                    </Td>
                    <Td>
                      <Flex gap={2}>
                        {build.trigger.type === 'manual' && (
                          <Button
                            variant="default"
                            size="S"
                            disabled={!build.enabled || isTriggering}
                            endIcon={<Play />}
                            onClick={() => handleTriggerBuild(build.name)}
                          >
                            {isTriggering ? 'Running...' : 'Trigger'}
                          </Button>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <EmptyStateLayout
              icon={<FileError width="160px" />}
              content={formatMessage({
                id: getTranslation('builds.empty'),
                defaultMessage: 'No builds found',
              })}
            />
          )}
        </Layouts.Content>
      </Main>
    </Layouts.Root>
  );
};

export default memo(BuildPage);
