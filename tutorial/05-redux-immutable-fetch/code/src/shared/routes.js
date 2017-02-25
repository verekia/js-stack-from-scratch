// @flow

/* eslint-disable import/prefer-default-export */

export const asyncHelloRoute = (num: ?number) => `/async/hello/${num || ':num'}`
