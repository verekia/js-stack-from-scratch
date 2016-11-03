// import { html } from 'common-tags';

export default (staticPath, title) => `
<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="${staticPath}/css/style.css">
  </head>
  <body>
    <div class="app"></div>
    <script src="${staticPath}/js/client-bundle.js"></script>
  </body>
</html>
`;
