import ApolloClient, {
  createNetworkInterface,
  addTypeName,
} from 'apollo-client';

const baseUrl = process.env.API_URL || 'http://localhost:1337';
const url = `${baseUrl}/graphql`;

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: url,
  }),
  initialState: typeof window !== 'undefined' ? window.__PRELOADED_STATE__ : null, // eslint-disable-line
  ssrForceFetchDelay: 100,
});

export default client;
