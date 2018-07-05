import http from 'http';
import * as next from 'next';
import {parse, UrlWithParsedQuery} from 'url';

const port: number = parseInt(process.env.PORT, 10) || 3000;
const dev: boolean = process.env.NODE_ENV !== 'production';

const app: next.Server = next({ dev });
const handle: any = app.getRequestHandler();

app.prepare()
  .then(() => {
    http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
      const parsedUrl: UrlWithParsedQuery = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === '/a') {
        app.render(req, res, '/a', query);
      } else if (pathname === '/b') {
        app.render(req, res, '/b', query);
      } else {
        handle(req, res, parsedUrl);
      }
    })
      .listen(port, (err: Error) => {
        if (err) {
          throw err;
        }
        console.log(`> Ready on http://localhost:${port}`);
      });
  });
