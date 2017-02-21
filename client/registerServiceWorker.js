import config from '../config';

if (!process.env.BUILD_FLAG_IS_DEV) {
  if (config('serviceWorker.enabled')) {
    const OfflinePluginRuntime = require('offline-plugin/runtime');

    OfflinePluginRuntime.install({
      onUpdating: () => undefined,
      onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
      onUpdated: () => window.location.reload(),
      onUpdateFailed: () => undefined,
    });
  }
}
