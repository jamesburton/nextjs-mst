// import { useMemo } from "react";
import {
    // applySnapshot,
    getRoot,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types,
} from "mobx-state-tree";
import { msalInstance, loginRequest } from './authConfig';

let authStore: IAuthStore | undefined;

export const AuthStore = types
    .model({
        // user: types.maybeNull(types.string),
        // token: types.maybeNull(types.string),
        // isAuth: types.optional(types.boolean, false),
        // example: '649',
        accessToken: types.maybeNull(types.string),
        accounts: types.maybeNull(types.frozen()),
        authority: types.maybeNull(types.string),
        expiresOn: types.maybeNull(types.Date),
        idToken: types.maybeNull(types.string),
        scopes: types.maybeNull(types.array(types.string)),
        tokenType: types.maybeNull(types.string),
        uniqueId: types.maybeNull(types.string),
    })
    .actions((self) => ({
        setAuthDetails: (result: any|null|undefined) => {
            console.log('setAuthDetails', result);
            self.accessToken = result?.accessToken;
            self.accounts = result?.accounts;
            self.authority = result?.authority;
            self.expiresOn = result?.expiresOn;
            self.idToken = result?.idToken;
            self.scopes = result?.scopes;
            self.tokenType = result?.tokenType;
            self.uniqueId = result?.uniqueId;
        },
        signIn: async () => {
            // console.log('signIn');
            /*
            self.user = "Fake User";
            self.token = "Fake Token";
            self.isAuth = true;
            self.example = '381';
            */
            try
            {
                var result = await msalInstance.loginPopup(loginRequest);
                console.log('Logged in, result=', result);
                var accounts = msalInstance.getAllAccounts();
                console.log('accounts', accounts);

                (self as any).setAuthDetails(result);
                /*
                self.user = "Fake User";
                self.token = "Fake Token";
                self.isAuth = true;
                self.example = '381';
                */
            }
            catch(ex)
            {
                console.error(ex);
            }
        },
        signOut: async () => {
            /*
            console.log('signOut');
            self.user = null;
            self.token = null;
            self.isAuth = false;
            self.example = '649';
            */
            try
            {
                await msalInstance.logoutPopup();
                console.log('Logged out');
                // self.user = null;
                // self.token = null;
                // self.isAuth = false;
                // self.example = '649';
                (self as any).setAuthDetails(null);
            }
            catch(ex)
            {
                console.error(ex);
            }
        }
    }))
    .views((self) => ({
        rootStore: () => getRoot(self)
    }))
    .volatile(self => ({
        msalInstance,
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