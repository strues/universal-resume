import { createAsyncComponent } from 'react-async-component';

export default createAsyncComponent({
  resolve: () => import('./Home'),
  ssrMode: 'boundary',
  name: 'Home',
});
