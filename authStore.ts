// import { useMemo } from "react";
import {
    // applySnapshot,
    getRoot,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types,
} from "mobx-state-tree";

// let authStore: IAuthStore | undefined;

export const AuthStore = types
    .model({
        user: types.maybeNull(types.string),
        token: types.maybeNull(types.string),
        isAuth: types.optional(types.boolean, false),
        example: '649',
    })
    .actions((self) => ({

    }))
    .views((self) => ({
        rootStore: () => getRoot(self),
    }));

export type IAuthStore = Instance<typeof AuthStore>;
export type IAuthStoreSnapshotIn = SnapshotIn<typeof AuthStore>;
export type IAuthStoreSnapshotOut = SnapshotOut<typeof AuthStore>;

/*
export function initializeStore(snapshot = null) {
    const _store = authStore ?? AuthStore.create({  });

    // If your page has Next.js data fetching methods that use a Mobx store, it will
    // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
    if (snapshot) {
        applySnapshot(_store, snapshot);
    }
    // For SSG and SSR always create a new store
    if (typeof window === "undefined") return _store;
    // Create the store once in the client
    if (!authStore) authStore = _store;

    return authStore;
}

export function useStore(initialState: any) {
    const store = useMemo(() => initializeStore(initialState), [initialState]);
    return store;
}
*/