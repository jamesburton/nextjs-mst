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

export const IdTokenClaims = types
    .model({
        at_hash: types.maybeNull(types.string), 
        aud: types.maybeNull(types.string),// NB: GUID
        auth_time: types.maybeNull(types.Date),
        emails: types.maybeNull(types.array(types.string)),
        exp: types.maybeNull(types.Date),
        family_name: types.maybeNull(types.string),
        given_name: types.maybeNull(types.string),
        iat: types.maybeNull(types.Date),
        iss: types.maybeNull(types.string),
        name: types.maybeNull(types.string),
        nbf: types.maybeNull(types.Date),
        nonce: types.maybeNull(types.string), // GUID
        oid: types.maybeNull(types.string), // GUID
        sub: types.maybeNull(types.string), // GUID
        tfp: types.maybeNull(types.string), // e.g. "B2C_1_signin-signup"
        ver: types.maybeNull(types.string), // e.g. "1.0"
    });

export const AuthStore = types
    .model({
        accessToken: types.maybeNull(types.string),
        accounts: types.maybeNull(types.frozen(null)),
        authority: types.maybeNull(types.string),
        expiresOn: types.maybeNull(types.Date),
        idToken: types.maybeNull(types.string),
        scopes: types.maybeNull(types.array(types.string)),
        tokenType: types.maybeNull(types.string),
        uniqueId: types.maybeNull(types.string),
        idTokenClaims: types.maybeNull(IdTokenClaims),
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
            self.idTokenClaims = result?.idTokenClaims;
        },
        signIn: async () => {
            try
            {
                var result = await msalInstance.loginPopup(loginRequest);
                console.log('Logged in, result=', result);
                var accounts = msalInstance.getAllAccounts();
                console.log('accounts', accounts);

                (self as any).setAuthDetails(result);
            }
            catch(ex)
            {
                console.error(ex);
            }
        },
        signOut: async () => {
            try
            {
                await msalInstance.logoutPopup();
                console.log('Logged out');
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