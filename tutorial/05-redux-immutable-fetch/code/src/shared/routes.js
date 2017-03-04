// @flow

/* eslint-disable import/prefer-default-export */

export const helloEndpointRoute = (num: ?number) => `/ajax/hello/${num || ':num'}`
