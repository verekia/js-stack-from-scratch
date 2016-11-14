import html from 'common-tags';
import { IS_PRODUCTION, STATIC_FOLDER } from '../config';

export default (title: string) =>
html`
<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <link> // TODO
  </head>
  <body>
    Hello Express, the environment is: ${IS_PRODUCTION ? 'Production' : 'Development'}
  </body>
</html>
`;
