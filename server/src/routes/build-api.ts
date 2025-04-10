export default [
  {
    method: 'POST',
    path: '/builds',
    handler: 'build.trigger',
  },
  {
    method: 'GET',
    path: '/builds',
    handler: 'build.find',
  },
];
