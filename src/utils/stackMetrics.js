export const buildTcMap = (tcList) => {
  const map = new Map();
  for (const tc of tcList) {
    map.set(tc.id, tc.name);
  }
  return map;
};

export const buildAppsMap = (apps) => {
  const map = new Map();
  for (const app of apps) {
    map.set(app.id, app);
  }
  return map;
};

export const buildProductAppIdsMap = (productApps) => {
  const map = new Map();
  for (const pa of productApps) {
    if (!map.has(pa.productId)) {
      map.set(pa.productId, []);
    }
    map.get(pa.productId).push(pa.appId);
  }
  return map;
};

export const buildStackSummaries = (products, appsMap, productAppIdsMap) => {
  const stackGroups = products.reduce((acc, product) => {
    const stack = product.stack || 'Unassigned';
    if (!acc[stack]) {
      acc[stack] = { products: [], tc: product.tc || '-' };
    }
    acc[stack].products.push(product);
    if (product.tc && acc[stack].tc === '-') {
      acc[stack].tc = product.tc;
    }
    return acc;
  }, {});

  return Object.keys(stackGroups).map(stackName => {
    const stackData = stackGroups[stackName];
    const stackAppIdSet = new Set();
    for (const product of stackData.products) {
      const appIds = productAppIdsMap.get(product.id) || [];
      for (const appId of appIds) {
        stackAppIdSet.add(appId);
      }
    }

    let criticalApps = 0;
    let openRisks = 0;
    for (const appId of stackAppIdSet) {
      const app = appsMap.get(appId);
      if (app) {
        if (app.resCat === 'Critical') criticalApps++;
        openRisks += app.openRisks || 0;
      }
    }

    return {
      name: stackName,
      productCount: stackData.products.length,
      appCount: stackAppIdSet.size,
      criticalApps,
      openRisks,
      tc: stackData.tc
    };
  });
};
