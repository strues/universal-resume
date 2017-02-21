import { createAsyncComponent } from 'react-async-component';

export default createAsyncComponent({
  resolve: () => import('./Contact'),
  ssrMode: 'boundary',
  name: 'Contact',
});
