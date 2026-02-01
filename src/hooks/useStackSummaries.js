import { useMemo } from 'react';
import {
  buildAppsMap,
  buildProductAppIdsMap,
  buildStackSummaries,
  buildTcMap,
} from '../utils/stackMetrics';

function useStackSummaries({ products, apps, productApps, tcList }) {
  const tcMap = useMemo(() => buildTcMap(tcList), [tcList]);
  const appsMap = useMemo(() => buildAppsMap(apps), [apps]);
  const productAppIdsMap = useMemo(() => buildProductAppIdsMap(productApps), [productApps]);

  const stacks = useMemo(
    () => buildStackSummaries(products, appsMap, productAppIdsMap),
    [products, appsMap, productAppIdsMap]
  );

  const getTcName = (tcId) => tcMap.get(tcId) || '-';

  return { stacks, getTcName };
}

export default useStackSummaries;
