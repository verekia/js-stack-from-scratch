// import { html } from 'common-tags';

const isProduction = process.env.NODE_ENV === 'production';

export default title => `
<!doctype html>
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    <div class="app"></div>
    <script src="/static/js/client-bundle${isProduction ? '.min' : ''}.js"></script>
  </body>
</html>
`;
