# strapi-plugin-website-builder-v5

V5 Port of https://market.strapi.io/plugins/strapi-plugin-website-builder

A plugin for Strapi that provides the ability to trigger website builds manually, periodically or through model events.

![NPM Version](https://img.shields.io/npm/v/strapi-plugin-website-builder-v5) ![NPM License](https://img.shields.io/npm/l/strapi-plugin-website-builder-v5)


## Features
- Admin panel support
- Ability to build logs
- 3 different trigger types: `manual`, `cron`, and `event`

## Requirements
- `strapi 5.x.x`


## Quick start

1. Install the package
```
npm i strapi-plugin-website-builder-v5
```

2. Enable the plugin and add triggers

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

## Configuration

> This part is excerpted and adapted from [the original plugin documentation](https://strapi-plugin-website-builder.netlify.app/build-triggers.html)

### Example
```ts
export default () => ({
  'strapi-plugin-website-builder-v5': {
    enabled: true,
    config: {
      // default values between all builds, can be overriden by specific build
      shared: {
        // // custom headers to be sent
        headers: [
          {
            "X-Powered-By": "Strapi CMS"
          }
        ],
        // URL parameters to be sent with the request
        params: {
          lorem: 'ipsum',
        },
      },
      // build configurations, for different build types see the section below
      builds: [
        {
          name: 'production',
          url: 'https://link-to-hit-on-trigger.com',
          trigger: {
            type: 'event',
            events: [
              {
                uid: 'api::articles.articles',
                actions: ['create'],
              },
            ],
          },
          // either GET or POST
          method: "POST",
          // custom headers to be sent
          headers: [
            {
              "X-Powered-By": "Strapi CMS"
            }
          ],
          // URL parameters to be sent with the request
          params: {
            lorem: 'ipsum',
          },
          // the data to be sent as the request body, only applicable for POST request
          body: {
            lorem: 'ipsum',
          }
        }
      ],
      // hook into specific areas to extend functionality
      hooks: {
        beforeRequest: (requestConfig) => {
          requestConfig.headers.custom = 'custom_value';
          return config;
        }
      }
    }
  }
});
```

### Build types

#### Manual trigger
The manual trigger will start a build whenever the trigger button in the admin panel is pressed for the respective build.

```ts
export default () => ({
  // ...
  'strapi-plugin-website-builder-v5': {
    enabled: true,
    config: {
      builds: [
        {
          name: 'production',
          url: 'https://link-to-hit-on-trigger.com',
          trigger: {
            type: 'manual'
          },
        },
      ],
    },
  },
  // ...
});
```

#### Periodic trigger
The periodic trigger will start a build at the interval specified by the cron expressions. The following example triggers a new build every hour.

```ts
export default () => ({
  // ...
  'strapi-plugin-website-builder-v5': {
    enabled: true,
    config: {
      builds: [
        {
          name: 'production',
          url: 'https://link-to-hit-on-trigger.com',
          trigger: {
            type: 'cron',
            expression: '0 */1 * * *'
          },
        },
      ],
    },
  },
  // ...
});
```

#### Event trigger
The periodic trigger will start a build at the interval specified by the cron expressions. The following example triggers a new build every hour.

```ts
export default () => ({
	// ...
  'strapi-plugin-website-builder-v5': {
    enabled: true,
    config: {
      builds: [
        {
          name: 'production',
          url: 'https://link-to-hit-on-trigger.com',
          trigger: {
            type: 'event',
            events: [
              {
                uid: 'api::articles.articles',
                actions: ['create'],
              },
            ],
          },
        },
      ],
    },
  },
  // ...
});
```

## Todo
- [ ] In-UI trigger configuration
- [ ] Improve typing
- [ ] Rename