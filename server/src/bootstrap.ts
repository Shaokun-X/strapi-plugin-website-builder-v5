import type { Core } from '@strapi/strapi';
import { getService } from './utils';
import { FILE_UID, EMIT_ACTIONS } from './constants';

function bootstrapCron({ strapi, build }) {
  // create cron check
  strapi.cron.add({
    [build.name]: {
      options: {
        rule: build.trigger.expression,
      },
      task: () => {
        getService({ strapi, name: 'build' }).trigger({
          name: build.name,
          trigger: { type: 'cron' },
        });
      },
    },
  });
}

function bootstrapEvents({ strapi, build }) {
  // build valid events
  const events = new Map();
  build.trigger.events.forEach((event) => {
    // setup actions
    let actions = new Set();
    if (event.actions === '*') {
      EMIT_ACTIONS.forEach((action) => actions.add(action));
    } else {
      event.actions.forEach((action) => actions.add(action));
    }

    // setup events
    if (event.uid === '*') {
      Object.keys(strapi.contentTypes)
        .filter((uid) => /^api::/.test(uid) || uid === FILE_UID)
        .forEach((uid) => {
          events.set(uid, actions);
        });
    } else {
      events.set(event.uid, actions);
    }
  });

  EMIT_ACTIONS.forEach((action) => {
    strapi.eventHub.on(`entry.${action}`, ({ uid, entry: record }) => {
      const entry = events.get(uid);
      if (entry && entry.has(action)) {
        getService({ strapi, name: 'build' }).trigger({
          name: build.name,
          record,
          trigger: { type: 'event' },
        });
      }
    });
  });
}

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  const builds = getService({ strapi, name: 'settings' }).get({ path: 'builds', defaultValue: [] });

  builds
    .filter((b) => b.enabled || typeof b.enabled === 'undefined')
    .forEach((build) => {
      if (build.trigger.type === 'cron') {
        bootstrapCron({ strapi, build });
      } else if (build.trigger.type === 'event') {
        bootstrapEvents({ strapi, build });
      }
      strapi.log.info(
        `[website builder] ${build.trigger.type} trigger enabled for ${build.name} build`
      );
    });
};

export default bootstrap;
