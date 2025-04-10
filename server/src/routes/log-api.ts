export default [
  {
    method: 'GET',
    path: '/logs',
    handler: 'log.find',
  },
  {
    method: 'DELETE',
    path: '/logs/:id',
    handler: 'log.delete',
  },
];
