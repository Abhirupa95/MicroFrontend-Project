import { importShared } from './__federation_fn_import-BV9PeGej.js';

const __vite_import_meta_env__$2 = {};
const isSelfAtom = (atom, a) => atom.unstable_is ? atom.unstable_is(a) : a === atom;
const hasInitialValue = (atom) => "init" in atom;
const isActuallyWritableAtom = (atom) => !!atom.write;
const isAtomStateInitialized = (atomState) => "v" in atomState || "e" in atomState;
const returnAtomValue = (atomState) => {
  if ("e" in atomState) {
    throw atomState.e;
  }
  if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && !("v" in atomState)) {
    throw new Error("[Bug] atom state is not initialized");
  }
  return atomState.v;
};
const PROMISE_STATE = Symbol();
const getPromiseState = (promise) => promise[PROMISE_STATE];
const isPendingPromise = (value) => {
  var _a;
  return isPromiseLike$1(value) && !((_a = getPromiseState(value)) == null ? void 0 : _a[1]);
};
const cancelPromise = (promise, nextValue) => {
  const promiseState = getPromiseState(promise);
  if (promiseState) {
    promiseState[1] = true;
    promiseState[0].forEach((fn) => fn(nextValue));
  } else if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
    throw new Error("[Bug] cancelable promise not found");
  }
};
const patchPromiseForCancelability = (promise) => {
  if (getPromiseState(promise)) {
    return;
  }
  const promiseState = [/* @__PURE__ */ new Set(), false];
  promise[PROMISE_STATE] = promiseState;
  const settle = () => {
    promiseState[1] = true;
  };
  promise.then(settle, settle);
  promise.onCancel = (fn) => {
    promiseState[0].add(fn);
  };
};
const isPromiseLike$1 = (p) => typeof (p == null ? void 0 : p.then) === "function";
const addPendingPromiseToDependency = (atom, promise, dependencyAtomState) => {
  if (!dependencyAtomState.p.has(atom)) {
    dependencyAtomState.p.add(atom);
    promise.then(
      () => {
        dependencyAtomState.p.delete(atom);
      },
      () => {
        dependencyAtomState.p.delete(atom);
      }
    );
  }
};
const setAtomStateValueOrPromise = (atom, valueOrPromise, ensureAtomState) => {
  const atomState = ensureAtomState(atom);
  const hasPrevValue = "v" in atomState;
  const prevValue = atomState.v;
  const pendingPromise = isPendingPromise(atomState.v) ? atomState.v : null;
  if (isPromiseLike$1(valueOrPromise)) {
    patchPromiseForCancelability(valueOrPromise);
    for (const a of atomState.d.keys()) {
      addPendingPromiseToDependency(atom, valueOrPromise, ensureAtomState(a));
    }
  }
  atomState.v = valueOrPromise;
  delete atomState.e;
  if (!hasPrevValue || !Object.is(prevValue, atomState.v)) {
    ++atomState.n;
    if (pendingPromise) {
      cancelPromise(pendingPromise, valueOrPromise);
    }
  }
};
const getMountedOrPendingDependents = (atom, atomState, mountedMap) => {
  var _a;
  const dependents = /* @__PURE__ */ new Set();
  for (const a of ((_a = mountedMap.get(atom)) == null ? void 0 : _a.t) || []) {
    if (mountedMap.has(a)) {
      dependents.add(a);
    }
  }
  for (const atomWithPendingPromise of atomState.p) {
    dependents.add(atomWithPendingPromise);
  }
  return dependents;
};
const createStoreHook = () => {
  const callbacks = /* @__PURE__ */ new Set();
  const notify = () => {
    callbacks.forEach((fn) => fn());
  };
  notify.add = (fn) => {
    callbacks.add(fn);
    return () => {
      callbacks.delete(fn);
    };
  };
  return notify;
};
const createStoreHookForAtoms = () => {
  const all = {};
  const callbacks = /* @__PURE__ */ new WeakMap();
  const notify = (atom) => {
    var _a, _b;
    (_a = callbacks.get(all)) == null ? void 0 : _a.forEach((fn) => fn(atom));
    (_b = callbacks.get(atom)) == null ? void 0 : _b.forEach((fn) => fn());
  };
  notify.add = (atom, fn) => {
    const key = atom || all;
    const fns = (callbacks.has(key) ? callbacks : callbacks.set(key, /* @__PURE__ */ new Set())).get(key);
    fns.add(fn);
    return () => {
      fns == null ? void 0 : fns.delete(fn);
      if (!fns.size) {
        callbacks.delete(key);
      }
    };
  };
  return notify;
};
const initializeStoreHooks = (storeHooks) => {
  storeHooks.c || (storeHooks.c = createStoreHookForAtoms());
  storeHooks.m || (storeHooks.m = createStoreHookForAtoms());
  storeHooks.u || (storeHooks.u = createStoreHookForAtoms());
  storeHooks.f || (storeHooks.f = createStoreHook());
  return storeHooks;
};
const BUILDING_BLOCKS = Symbol();
const buildStore = (atomStateMap = /* @__PURE__ */ new WeakMap(), mountedMap = /* @__PURE__ */ new WeakMap(), invalidatedAtoms = /* @__PURE__ */ new WeakMap(), changedAtoms = /* @__PURE__ */ new Set(), mountCallbacks = /* @__PURE__ */ new Set(), unmountCallbacks = /* @__PURE__ */ new Set(), storeHooks = {}, atomRead = (atom, ...params) => atom.read(...params), atomWrite = (atom, ...params) => atom.write(...params), atomOnInit = (atom, store) => {
  var _a;
  return (_a = atom.unstable_onInit) == null ? void 0 : _a.call(atom, store);
}, atomOnMount = (atom, setAtom) => {
  var _a;
  return (_a = atom.onMount) == null ? void 0 : _a.call(atom, setAtom);
}, ...buildingBlockFunctions) => {
  const ensureAtomState = buildingBlockFunctions[0] || ((atom) => {
    if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && !atom) {
      throw new Error("Atom is undefined or null");
    }
    let atomState = atomStateMap.get(atom);
    if (!atomState) {
      atomState = { d: /* @__PURE__ */ new Map(), p: /* @__PURE__ */ new Set(), n: 0 };
      atomStateMap.set(atom, atomState);
      atomOnInit == null ? void 0 : atomOnInit(atom, store);
    }
    return atomState;
  });
  const flushCallbacks = buildingBlockFunctions[1] || (() => {
    let hasError;
    let error;
    const call = (fn) => {
      try {
        fn();
      } catch (e) {
        if (!hasError) {
          hasError = true;
          error = e;
        }
      }
    };
    do {
      if (storeHooks.f) {
        call(storeHooks.f);
      }
      const callbacks = /* @__PURE__ */ new Set();
      const add = callbacks.add.bind(callbacks);
      changedAtoms.forEach((atom) => {
        var _a;
        return (_a = mountedMap.get(atom)) == null ? void 0 : _a.l.forEach(add);
      });
      changedAtoms.clear();
      unmountCallbacks.forEach(add);
      unmountCallbacks.clear();
      mountCallbacks.forEach(add);
      mountCallbacks.clear();
      callbacks.forEach(call);
      if (changedAtoms.size) {
        recomputeInvalidatedAtoms();
      }
    } while (changedAtoms.size || unmountCallbacks.size || mountCallbacks.size);
    if (hasError) {
      throw error;
    }
  });
  const recomputeInvalidatedAtoms = buildingBlockFunctions[2] || (() => {
    var _a;
    const topSortedReversed = [];
    const visiting = /* @__PURE__ */ new WeakSet();
    const visited = /* @__PURE__ */ new WeakSet();
    const stack = Array.from(changedAtoms);
    while (stack.length) {
      const a = stack[stack.length - 1];
      const aState = ensureAtomState(a);
      if (visited.has(a)) {
        stack.pop();
        continue;
      }
      if (visiting.has(a)) {
        if (invalidatedAtoms.get(a) === aState.n) {
          topSortedReversed.push([a, aState, aState.n]);
        } else if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && invalidatedAtoms.has(a)) {
          throw new Error("[Bug] invalidated atom exists");
        }
        visited.add(a);
        stack.pop();
        continue;
      }
      visiting.add(a);
      for (const d of getMountedOrPendingDependents(a, aState, mountedMap)) {
        if (!visiting.has(d)) {
          stack.push(d);
        }
      }
    }
    for (let i = topSortedReversed.length - 1; i >= 0; --i) {
      const [a, aState, prevEpochNumber] = topSortedReversed[i];
      let hasChangedDeps = false;
      for (const dep of aState.d.keys()) {
        if (dep !== a && changedAtoms.has(dep)) {
          hasChangedDeps = true;
          break;
        }
      }
      if (hasChangedDeps) {
        readAtomState(a);
        mountDependencies(a);
        if (prevEpochNumber !== aState.n) {
          changedAtoms.add(a);
          (_a = storeHooks.c) == null ? void 0 : _a.call(storeHooks, a);
        }
      }
      invalidatedAtoms.delete(a);
    }
  });
  const readAtomState = buildingBlockFunctions[3] || ((atom) => {
    var _a, _b;
    const atomState = ensureAtomState(atom);
    if (isAtomStateInitialized(atomState)) {
      if (mountedMap.has(atom) && invalidatedAtoms.get(atom) !== atomState.n) {
        return atomState;
      }
      if (Array.from(atomState.d).every(
        ([a, n]) => (
          // Recursively, read the atom state of the dependency, and
          // check if the atom epoch number is unchanged
          readAtomState(a).n === n
        )
      )) {
        return atomState;
      }
    }
    atomState.d.clear();
    let isSync = true;
    const mountDependenciesIfAsync = () => {
      if (mountedMap.has(atom)) {
        mountDependencies(atom);
        recomputeInvalidatedAtoms();
        flushCallbacks();
      }
    };
    const getter = (a) => {
      var _a2;
      if (isSelfAtom(atom, a)) {
        const aState2 = ensureAtomState(a);
        if (!isAtomStateInitialized(aState2)) {
          if (hasInitialValue(a)) {
            setAtomStateValueOrPromise(a, a.init, ensureAtomState);
          } else {
            throw new Error("no atom init");
          }
        }
        return returnAtomValue(aState2);
      }
      const aState = readAtomState(a);
      try {
        return returnAtomValue(aState);
      } finally {
        atomState.d.set(a, aState.n);
        if (isPendingPromise(atomState.v)) {
          addPendingPromiseToDependency(atom, atomState.v, aState);
        }
        (_a2 = mountedMap.get(a)) == null ? void 0 : _a2.t.add(atom);
        if (!isSync) {
          mountDependenciesIfAsync();
        }
      }
    };
    let controller;
    let setSelf;
    const options = {
      get signal() {
        if (!controller) {
          controller = new AbortController();
        }
        return controller.signal;
      },
      get setSelf() {
        if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && !isActuallyWritableAtom(atom)) {
          console.warn("setSelf function cannot be used with read-only atom");
        }
        if (!setSelf && isActuallyWritableAtom(atom)) {
          setSelf = (...args) => {
            if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && isSync) {
              console.warn("setSelf function cannot be called in sync");
            }
            if (!isSync) {
              try {
                return writeAtomState(atom, ...args);
              } finally {
                recomputeInvalidatedAtoms();
                flushCallbacks();
              }
            }
          };
        }
        return setSelf;
      }
    };
    const prevEpochNumber = atomState.n;
    try {
      const valueOrPromise = atomRead(atom, getter, options);
      setAtomStateValueOrPromise(atom, valueOrPromise, ensureAtomState);
      if (isPromiseLike$1(valueOrPromise)) {
        (_a = valueOrPromise.onCancel) == null ? void 0 : _a.call(valueOrPromise, () => controller == null ? void 0 : controller.abort());
        valueOrPromise.then(
          mountDependenciesIfAsync,
          mountDependenciesIfAsync
        );
      }
      return atomState;
    } catch (error) {
      delete atomState.v;
      atomState.e = error;
      ++atomState.n;
      return atomState;
    } finally {
      isSync = false;
      if (prevEpochNumber !== atomState.n && invalidatedAtoms.get(atom) === prevEpochNumber) {
        invalidatedAtoms.set(atom, atomState.n);
        changedAtoms.add(atom);
        (_b = storeHooks.c) == null ? void 0 : _b.call(storeHooks, atom);
      }
    }
  });
  const invalidateDependents = buildingBlockFunctions[4] || ((atom) => {
    const stack = [atom];
    while (stack.length) {
      const a = stack.pop();
      const aState = ensureAtomState(a);
      for (const d of getMountedOrPendingDependents(a, aState, mountedMap)) {
        const dState = ensureAtomState(d);
        invalidatedAtoms.set(d, dState.n);
        stack.push(d);
      }
    }
  });
  const writeAtomState = buildingBlockFunctions[5] || ((atom, ...args) => {
    let isSync = true;
    const getter = (a) => returnAtomValue(readAtomState(a));
    const setter = (a, ...args2) => {
      var _a;
      const aState = ensureAtomState(a);
      try {
        if (isSelfAtom(atom, a)) {
          if (!hasInitialValue(a)) {
            throw new Error("atom not writable");
          }
          const prevEpochNumber = aState.n;
          const v = args2[0];
          setAtomStateValueOrPromise(a, v, ensureAtomState);
          mountDependencies(a);
          if (prevEpochNumber !== aState.n) {
            changedAtoms.add(a);
            (_a = storeHooks.c) == null ? void 0 : _a.call(storeHooks, a);
            invalidateDependents(a);
          }
          return void 0;
        } else {
          return writeAtomState(a, ...args2);
        }
      } finally {
        if (!isSync) {
          recomputeInvalidatedAtoms();
          flushCallbacks();
        }
      }
    };
    try {
      return atomWrite(atom, getter, setter, ...args);
    } finally {
      isSync = false;
    }
  });
  const mountDependencies = buildingBlockFunctions[6] || ((atom) => {
    var _a;
    const atomState = ensureAtomState(atom);
    const mounted = mountedMap.get(atom);
    if (mounted && !isPendingPromise(atomState.v)) {
      for (const [a, n] of atomState.d) {
        if (!mounted.d.has(a)) {
          const aState = ensureAtomState(a);
          const aMounted = mountAtom(a);
          aMounted.t.add(atom);
          mounted.d.add(a);
          if (n !== aState.n) {
            changedAtoms.add(a);
            (_a = storeHooks.c) == null ? void 0 : _a.call(storeHooks, a);
            invalidateDependents(a);
          }
        }
      }
      for (const a of mounted.d || []) {
        if (!atomState.d.has(a)) {
          mounted.d.delete(a);
          const aMounted = unmountAtom(a);
          aMounted == null ? void 0 : aMounted.t.delete(atom);
        }
      }
    }
  });
  const mountAtom = buildingBlockFunctions[7] || ((atom) => {
    var _a;
    const atomState = ensureAtomState(atom);
    let mounted = mountedMap.get(atom);
    if (!mounted) {
      readAtomState(atom);
      for (const a of atomState.d.keys()) {
        const aMounted = mountAtom(a);
        aMounted.t.add(atom);
      }
      mounted = {
        l: /* @__PURE__ */ new Set(),
        d: new Set(atomState.d.keys()),
        t: /* @__PURE__ */ new Set()
      };
      mountedMap.set(atom, mounted);
      (_a = storeHooks.m) == null ? void 0 : _a.call(storeHooks, atom);
      if (isActuallyWritableAtom(atom)) {
        const processOnMount = () => {
          let isSync = true;
          const setAtom = (...args) => {
            try {
              return writeAtomState(atom, ...args);
            } finally {
              if (!isSync) {
                recomputeInvalidatedAtoms();
                flushCallbacks();
              }
            }
          };
          try {
            const onUnmount = atomOnMount(atom, setAtom);
            if (onUnmount) {
              mounted.u = () => {
                isSync = true;
                try {
                  onUnmount();
                } finally {
                  isSync = false;
                }
              };
            }
          } finally {
            isSync = false;
          }
        };
        mountCallbacks.add(processOnMount);
      }
    }
    return mounted;
  });
  const unmountAtom = buildingBlockFunctions[8] || ((atom) => {
    var _a;
    const atomState = ensureAtomState(atom);
    let mounted = mountedMap.get(atom);
    if (mounted && !mounted.l.size && !Array.from(mounted.t).some((a) => {
      var _a2;
      return (_a2 = mountedMap.get(a)) == null ? void 0 : _a2.d.has(atom);
    })) {
      if (mounted.u) {
        unmountCallbacks.add(mounted.u);
      }
      mounted = void 0;
      mountedMap.delete(atom);
      (_a = storeHooks.u) == null ? void 0 : _a.call(storeHooks, atom);
      for (const a of atomState.d.keys()) {
        const aMounted = unmountAtom(a);
        aMounted == null ? void 0 : aMounted.t.delete(atom);
      }
      return void 0;
    }
    return mounted;
  });
  const buildingBlocks = [
    // store state
    atomStateMap,
    mountedMap,
    invalidatedAtoms,
    changedAtoms,
    mountCallbacks,
    unmountCallbacks,
    storeHooks,
    // atom intercepters
    atomRead,
    atomWrite,
    atomOnInit,
    atomOnMount,
    // building-block functions
    ensureAtomState,
    flushCallbacks,
    recomputeInvalidatedAtoms,
    readAtomState,
    invalidateDependents,
    writeAtomState,
    mountDependencies,
    mountAtom,
    unmountAtom
  ];
  const store = {
    get: (atom) => returnAtomValue(readAtomState(atom)),
    set: (atom, ...args) => {
      try {
        return writeAtomState(atom, ...args);
      } finally {
        recomputeInvalidatedAtoms();
        flushCallbacks();
      }
    },
    sub: (atom, listener) => {
      const mounted = mountAtom(atom);
      const listeners = mounted.l;
      listeners.add(listener);
      flushCallbacks();
      return () => {
        listeners.delete(listener);
        unmountAtom(atom);
        flushCallbacks();
      };
    }
  };
  Object.defineProperty(store, BUILDING_BLOCKS, { value: buildingBlocks });
  return store;
};
const INTERNAL_buildStoreRev1 = buildStore;
const INTERNAL_initializeStoreHooks = initializeStoreHooks;

const __vite_import_meta_env__$1 = {};
let keyCount = 0;
function atom(read, write) {
  const key = `atom${++keyCount}`;
  const config = {
    toString() {
      return (__vite_import_meta_env__$1 ? "production" : void 0) !== "production" && this.debugLabel ? key + ":" + this.debugLabel : key;
    }
  };
  if (typeof read === "function") {
    config.read = read;
  } else {
    config.init = read;
    config.read = defaultRead;
    config.write = defaultWrite;
  }
  if (write) {
    config.write = write;
  }
  return config;
}
function defaultRead(get) {
  return get(this);
}
function defaultWrite(get, set, arg) {
  return set(
    this,
    typeof arg === "function" ? arg(get(this)) : arg
  );
}
const createDevStoreRev4 = () => {
  let inRestoreAtom = 0;
  const storeHooks = INTERNAL_initializeStoreHooks({});
  const atomStateMap = /* @__PURE__ */ new WeakMap();
  const mountedAtoms = /* @__PURE__ */ new WeakMap();
  const store = INTERNAL_buildStoreRev1(
    atomStateMap,
    mountedAtoms,
    void 0,
    void 0,
    void 0,
    void 0,
    storeHooks,
    void 0,
    (atom2, get, set, ...args) => {
      if (inRestoreAtom) {
        return set(atom2, ...args);
      }
      return atom2.write(get, set, ...args);
    }
  );
  const debugMountedAtoms = /* @__PURE__ */ new Set();
  storeHooks.m.add(void 0, (atom2) => {
    debugMountedAtoms.add(atom2);
    const atomState = atomStateMap.get(atom2);
    atomState.m = mountedAtoms.get(atom2);
  });
  storeHooks.u.add(void 0, (atom2) => {
    debugMountedAtoms.delete(atom2);
    const atomState = atomStateMap.get(atom2);
    delete atomState.m;
  });
  const devStore = {
    // store dev methods (these are tentative and subject to change without notice)
    dev4_get_internal_weak_map: () => atomStateMap,
    dev4_get_mounted_atoms: () => debugMountedAtoms,
    dev4_restore_atoms: (values) => {
      const restoreAtom = {
        read: () => null,
        write: (_get, set) => {
          ++inRestoreAtom;
          try {
            for (const [atom2, value] of values) {
              if ("init" in atom2) {
                set(atom2, value);
              }
            }
          } finally {
            --inRestoreAtom;
          }
        }
      };
      store.set(restoreAtom);
    }
  };
  return Object.assign(store, devStore);
};
const createStore = () => {
  if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production") {
    return createDevStoreRev4();
  }
  const store = INTERNAL_buildStoreRev1();
  return store;
};
let defaultStore;
const getDefaultStore = () => {
  if (!defaultStore) {
    defaultStore = createStore();
    if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production") {
      globalThis.__JOTAI_DEFAULT_STORE__ || (globalThis.__JOTAI_DEFAULT_STORE__ = defaultStore);
      if (globalThis.__JOTAI_DEFAULT_STORE__ !== defaultStore) {
        console.warn(
          "Detected multiple Jotai instances. It may cause unexpected behavior with the default store. https://github.com/pmndrs/jotai/discussions/2044"
        );
      }
    }
  }
  return defaultStore;
};

const __vite_import_meta_env__ = {};
const ReactExports = await importShared('react');
const {createContext,useContext,useRef,createElement,useReducer,useEffect,useDebugValue,useCallback} = ReactExports;
const StoreContext = createContext(
  void 0
);
const useStore = (options) => {
  const store = useContext(StoreContext);
  return (options == null ? void 0 : options.store) || store || getDefaultStore();
};
const Provider = ({
  children,
  store
}) => {
  const storeRef = useRef(void 0);
  if (!store && !storeRef.current) {
    storeRef.current = createStore();
  }
  return createElement(
    StoreContext.Provider,
    {
      value: store || storeRef.current
    },
    children
  );
};
const isPromiseLike = (x) => typeof (x == null ? void 0 : x.then) === "function";
const attachPromiseMeta = (promise) => {
  promise.status = "pending";
  promise.then(
    (v) => {
      promise.status = "fulfilled";
      promise.value = v;
    },
    (e) => {
      promise.status = "rejected";
      promise.reason = e;
    }
  );
};
const use = ReactExports.use || ((promise) => {
  if (promise.status === "pending") {
    throw promise;
  } else if (promise.status === "fulfilled") {
    return promise.value;
  } else if (promise.status === "rejected") {
    throw promise.reason;
  } else {
    attachPromiseMeta(promise);
    throw promise;
  }
});
const continuablePromiseMap = /* @__PURE__ */ new WeakMap();
const createContinuablePromise = (promise) => {
  let continuablePromise = continuablePromiseMap.get(promise);
  if (!continuablePromise) {
    continuablePromise = new Promise((resolve, reject) => {
      let curr = promise;
      const onFulfilled = (me) => (v) => {
        if (curr === me) {
          resolve(v);
        }
      };
      const onRejected = (me) => (e) => {
        if (curr === me) {
          reject(e);
        }
      };
      const registerCancelHandler = (p) => {
        if ("onCancel" in p && typeof p.onCancel === "function") {
          p.onCancel((nextValue) => {
            if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && nextValue === p) {
              throw new Error("[Bug] p is not updated even after cancelation");
            }
            if (isPromiseLike(nextValue)) {
              continuablePromiseMap.set(nextValue, continuablePromise);
              curr = nextValue;
              nextValue.then(onFulfilled(nextValue), onRejected(nextValue));
              registerCancelHandler(nextValue);
            } else {
              resolve(nextValue);
            }
          });
        }
      };
      promise.then(onFulfilled(promise), onRejected(promise));
      registerCancelHandler(promise);
    });
    continuablePromiseMap.set(promise, continuablePromise);
  }
  return continuablePromise;
};
function useAtomValue(atom, options) {
  const store = useStore(options);
  const [[valueFromReducer, storeFromReducer, atomFromReducer], rerender] = useReducer(
    (prev) => {
      const nextValue = store.get(atom);
      if (Object.is(prev[0], nextValue) && prev[1] === store && prev[2] === atom) {
        return prev;
      }
      return [nextValue, store, atom];
    },
    void 0,
    () => [store.get(atom), store, atom]
  );
  let value = valueFromReducer;
  if (storeFromReducer !== store || atomFromReducer !== atom) {
    rerender();
    value = store.get(atom);
  }
  const delay = options == null ? void 0 : options.delay;
  useEffect(() => {
    const unsub = store.sub(atom, () => {
      if (typeof delay === "number") {
        const value2 = store.get(atom);
        if (isPromiseLike(value2)) {
          attachPromiseMeta(createContinuablePromise(value2));
        }
        setTimeout(rerender, delay);
        return;
      }
      rerender();
    });
    rerender();
    return unsub;
  }, [store, atom, delay]);
  useDebugValue(value);
  if (isPromiseLike(value)) {
    const promise = createContinuablePromise(value);
    return use(promise);
  }
  return value;
}
function useSetAtom(atom, options) {
  const store = useStore(options);
  const setAtom = useCallback(
    (...args) => {
      if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && !("write" in atom)) {
        throw new Error("not writable atom");
      }
      return store.set(atom, ...args);
    },
    [store, atom]
  );
  return setAtom;
}
function useAtom(atom, options) {
  return [
    useAtomValue(atom, options),
    // We do wrong type assertion here, which results in throwing an error.
    useSetAtom(atom, options)
  ];
}

export { Provider, atom, createStore, getDefaultStore, useAtom, useAtomValue, useSetAtom, useStore };
