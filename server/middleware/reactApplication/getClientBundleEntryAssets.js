/**
 * This file resolves the entry assets available from our client bundle.
 */

import fs from 'fs';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import config from '../../../config';

let resultCache;

export default function getClientBundleEntryAssets() {
  if (!process.env.BUILD_FLAG_IS_DEV && resultCache) {
    return resultCache;
  }

  const assetsFilePath = pathResolve(
    appRootDir.get(),
    config('bundles.client.outputPath'),
    `./${config('bundleAssetsFileName')}`,
  );

  if (!fs.existsSync(assetsFilePath)) {
    throw new Error(
      `We could not find the "${assetsFilePath}" file, which contains a list of the assets of the client bundle.  Please ensure that the client bundle has been built.`,
    );
  }

  const readAssetsJSONFile = () => JSON.parse(fs.readFileSync(assetsFilePath, 'utf8'));
  const assetsJSONCache = readAssetsJSONFile();
  if (typeof assetsJSONCache.index === 'undefined') {
    throw new Error('No asset data found for expected "index" entry chunk of client bundle.');
  }
  resultCache = assetsJSONCache.index;
  return resultCache;
}
