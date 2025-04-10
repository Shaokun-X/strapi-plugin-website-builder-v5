import buildAPIRoutes from './build-api';
import logAPIRoutes from './log-api';

const routes = {
  admin: {
    type: 'admin',
    routes: [...buildAPIRoutes, ...logAPIRoutes],
  },
};

export default routes;
