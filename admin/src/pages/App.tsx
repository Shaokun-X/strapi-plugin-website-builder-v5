import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import Builds from './Builds';
import Logs from './Logs';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route index element={<Builds />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="*" element={<Page.Error />} />
      </Routes>
    </QueryClientProvider>
  );
};

export { App };
