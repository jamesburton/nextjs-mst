import { Provider } from "mobx-react";
import { useStore } from "../store";
import { useEffect } from 'react';
// import { MsalProvider, useMsal } from '@azure/msal-react';
import { EventType } from '@azure/msal-browser';
import { b2cPolicies, protectedResources } from '../authConfig';
import { compareIssuingPolicy } from '../utils/claimUtils';

import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import { IdTokenData } from "../components/DataDisplay";

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialState);

  const { instance } = useMsal();    
  const activeAccount = instance.getActiveAccount();

  useEffect(() => store.auth.tryAutoLoad());

  return (
    <Provider store={store}>
      <MsalSync />
      <Component {...pageProps} />
      {/* from https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/pages/Home.jsx */}
      <AuthenticatedTemplate>
          {
              activeAccount ?
              <Container>
                      <IdTokenData idTokenClaims={activeAccount.idTokenClaims} />
              </Container>
              :
              null
          }
      </AuthenticatedTemplate>
    </Provider>
  );
}

const Container = ({children}) => <div>{children}</div>;

// Based on https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/2-call-api-b2c/SPA/src/App.jsx
const MsalSync = () => {
    /**
     * useMsal is hook that returns the PublicClientApplication instance,
     * an array of all accounts currently signed in and an inProgress value
     * that tells you what msal is currently doing. For more, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
     */
    const { instance } = useMsal();
    useEffect(() => {
        const callbackId = instance.addEventCallback((event) => {
            if (
                (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
                // event.payload.account
                (event.payload as any).account
            ) {
                /**
                 * For the purpose of setting an active account for UI update, we want to consider only the auth
                 * response resulting from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy
                 * policies may use "acr" instead of "tfp"). To learn more about B2C tokens, visit:
                 * https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
                 */
                // if (compareIssuingPolicy(event.payload.idTokenClaims, b2cPolicies.names.editProfile)) {
                if (compareIssuingPolicy((event.payload as any).idTokenClaims, b2cPolicies.names.editProfile)) {
                    // retrieve the account from initial sing-in to the app
                    const originalSignInAccount = instance
                        .getAllAccounts()
                        .find(
                            (account) =>
                                // account.idTokenClaims.oid === event.payload.idTokenClaims.oid &&
                                // account.idTokenClaims.sub === event.payload.idTokenClaims.sub && 
                                (account.idTokenClaims as any).oid === (event.payload as any).idTokenClaims.oid &&
                                (account.idTokenClaims as any).sub === (event.payload as any).idTokenClaims.sub && 
                                compareIssuingPolicy(account.idTokenClaims, b2cPolicies.names.signUpSignIn)        
                        );

                    let signUpSignInFlowRequest = {
                        authority: b2cPolicies.authorities.signUpSignIn.authority,
                        account: originalSignInAccount,
                    };

                    // silently login again with the signUpSignIn policy
                    instance.ssoSilent(signUpSignInFlowRequest);
                }

                /**
                 * Below we are checking if the user is returning from the reset password flow.
                 * If so, we will ask the user to reauthenticate with their new password.
                 * If you do not want this behavior and prefer your users to stay signed in instead,
                 * you can replace the code below with the same pattern used for handling the return from
                 * profile edit flow
                 */
                // if (compareIssuingPolicy(event.payload.idTokenClaims, b2cPolicies.names.forgotPassword)) {
                if (compareIssuingPolicy((event.payload as any).idTokenClaims, b2cPolicies.names.forgotPassword)) {
                    let signUpSignInFlowRequest = {
                        authority: b2cPolicies.authorities.signUpSignIn.authority,
                        scopes: [
                            ...protectedResources.apiTodoList.scopes.read,
                            ...protectedResources.apiTodoList.scopes.write,
                        ],
                    };
                    instance.loginRedirect(signUpSignInFlowRequest);
                }
            }

            if (event.eventType === EventType.LOGIN_FAILURE) {
                // Check for forgot password error
                // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
                // if (event.error && event.error.errorMessage.includes('AADB2C90118')) {
                if (event.error && (event.error as any).errorMessage.includes('AADB2C90118')) {
                    const resetPasswordRequest = {
                        authority: b2cPolicies.authorities.forgotPassword.authority,
                        scopes: [],
                    };
                    instance.loginRedirect(resetPasswordRequest);
                }
            }
        });

        return () => {
            if (callbackId) {
                instance.removeEventCallback(callbackId);
            }
        };
        // eslint-disable-next-line
    }, [instance]);

    return null;
};