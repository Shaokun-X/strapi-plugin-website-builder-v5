# strapi-plugin-website-builder-v5

V5 Port of https://market.strapi.io/plugins/strapi-plugin-website-builder

## Config example

```ts
export default () => ({
  'strapi-plugin-website-builder-v5': {
    enabled: true,
    config: {
      builds: [
        {
          name: 'manual-build',
          url: 'http://localhost:3000',
          trigger: {
            type: 'manual',
          },
        },
      ],
    },
  },
});
```
