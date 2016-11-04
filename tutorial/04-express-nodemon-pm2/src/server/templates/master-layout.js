// import { html } from 'common-tags';

import { STATIC_PATH } from '../config';

export default title => `
<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="${STATIC_PATH}/css/style.css">
  </head>
  <body>
    <div class="app"></div>
    <script src="${STATIC_PATH}/js/client-bundle.js"></script>
  </body>
</html>
`;
