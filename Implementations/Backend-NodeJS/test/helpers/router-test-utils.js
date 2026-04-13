const path = require('node:path');

function loadModuleWithMocks(modulePath, mocks) {
  const resolvedModulePath = require.resolve(modulePath);
  const installedMocks = [];

  for (const [request, exports] of Object.entries(mocks)) {
    const resolvedRequest = require.resolve(request, {
      paths: [path.dirname(resolvedModulePath)],
    });

    installedMocks.push({
      resolvedRequest,
      previous: require.cache[resolvedRequest],
    });

    require.cache[resolvedRequest] = {
      id: resolvedRequest,
      filename: resolvedRequest,
      loaded: true,
      exports,
    };
  }

  delete require.cache[resolvedModulePath];
  const loadedModule = require(resolvedModulePath);

  const cleanup = () => {
    delete require.cache[resolvedModulePath];

    for (const { resolvedRequest, previous } of installedMocks) {
      if (previous) {
        require.cache[resolvedRequest] = previous;
      } else {
        delete require.cache[resolvedRequest];
      }
    }
  };

  return { loadedModule, cleanup };
}

function getRouteHandler(router, method, routePath) {
  const layer = router.stack.find((entry) => (
    entry.route &&
    entry.route.path === routePath &&
    entry.route.methods[method]
  ));

  if (!layer) {
    throw new Error(`Route not found for ${method.toUpperCase()} ${routePath}`);
  }

  return layer.route.stack[layer.route.stack.length - 1].handle;
}

function createMockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function createQueryMock(sequence) {
  const calls = [];
  let index = 0;

  const query = async (...args) => {
    calls.push(args);
    const nextValue = sequence[index];
    index += 1;

    if (nextValue instanceof Error) {
      throw nextValue;
    }

    return nextValue;
  };

  query.calls = calls;
  return query;
}

module.exports = {
  loadModuleWithMocks,
  getRouteHandler,
  createMockResponse,
  createQueryMock,
};
