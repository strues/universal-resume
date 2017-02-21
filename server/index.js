/* eslint-disable no-console */
import { resolve as pathResolve } from 'path';
import { createServer } from 'http';
import express from 'express';
import compression from 'compression';
import appRootDir from 'app-root-dir';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { printSchema } from 'graphql/utilities/schemaPrinter';

import config from '../config';
import reactApplication from './middleware/reactApplication';
import security from './middleware/security';
import clientBundle from './middleware/clientBundle';
import serviceWorker from './middleware/serviceWorker';
import offlinePage from './middleware/offlinePage';
import errorHandlers from './middleware/errorHandlers';

import schema from './graphql/schema';

const app = express();

app.disable('x-powered-by');
app.use(...security);
app.use(compression());

if (!process.env.BUILD_FLAG_IS_DEV && config('serviceWorker.enabled')) {
  app.get(`/${config('serviceWorker.fileName')}`, serviceWorker);
  app.get(
    `${config('bundles.client.webPath')}${config('serviceWorker.offlinePageFileName')}`,
    offlinePage,
  );
}

app.use(config('bundles.client.webPath'), clientBundle);

app.use(express.static(pathResolve(appRootDir.get(), config('publicAssetsPath'))));

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  context: {},
}));
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));
app.use('/schema', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(printSchema(schema));
});

app.get('*', reactApplication);

app.use(...errorHandlers);


const listener = app.listen(config('port'), config('host'), () =>
  console.log(`Server listening on port ${config('port')}`),
);

// WebSocket server for subscriptions
// const websocketServer = createServer((request, response) => {
//   response.writeHead(404);
//   response.end();
// });
// websocketServer.listen(8090, () => console.log( // eslint-disable-line no-console
//   `Websocket Server is now running on http://localhost:${WS_PORT}`,
// ));

// // eslint-disable-next-line
// new SubscriptionServer(
//   { subscriptionManager },
//   websocketServer,
// );

export default listener;
