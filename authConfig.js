/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";
import { PublicClientApplication } from "@azure/msal-browser";

/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
    names: {
        // signUpSignIn: 'B2C_1_susi_v2',
        signUpSignIn: process.env.AZURE_AD_SIGNUP_FLOW,
        // forgotPassword: 'B2C_1_reset_v3',
        forgotPassword: process.env.AZURE_AD_FORGOT_PASSWORD_FLOW,
        // editProfile: 'B2C_1_edit_profile_v2',
        editProfile: process.env.AZURE_AD_EDIT_PROFILE_FLOW,
    },
    authorities: {
        /*
        signUpSignIn: {
            authority: `https://${process.env.AZURE_AD_TENANT}.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_susi_v2`,
        },
        forgotPassword: {
            authority: `https://${process.env.AZURE_AD_TENANT}.b2clogin.com/fabrikamb2c.onmicrosoft.com/B2C_1_reset_v3`,
        },
        editProfile: {
            authority: `https://${process.env.AZURE_AD_TENANT}.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_edit_profile_v2`,
        },
        */
        signUpSignIn: process.env.AZURE_AD_SIGNUP_FLOW && {
            authority: `https://${process.env.AZURE_AD_TENANT}.b2clogin.com/${process.env.AZURE_AD_TENANT}.onmicrosoft.com/${process.env.AZURE_AD_SIGNUP_FLOW}`,
        },
        // forgotPassword: process.env.AZURE_AD_FORGOT_PASSWORD_FLOW && {
        //     authority: `https://${process.env.AZURE_AD_TENANT}.b2clogin.com/${process.env.AZURE_AD_TENANT}.onmicrosoft.com/${process.env.AZURE_AD_FORGOT_PASSWORD_FLOW}`,
        // },
        // editProfile: process.env.AZURE_AD_EDIT_PROFILE_FLOW && {
        //     authority: `https://${process.env.AZURE_AD_TENANT}.b2clogin.com/${process.env.AZURE_AD_TENANT}.onmicrosoft.com/${process.env.AZURE_AD_EDIT_PROFILE_FLOW}`,
        // },
    },
    // authorityDomain: 'fabrikamb2c.b2clogin.com',
    authorityDomain: `${process.env.AZURE_AD_TENANT}.b2clogin.com`,
};

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 * + Simpler Example: https://learn.microsoft.com/en-us/answers/questions/904183/spa-application-aadsts50049-invalid-instance-error
 */
export const msalConfig = {
    auth: {
        // clientId: `<your-clientID>`,
        clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
        // authority: `https://<your-tenant>.b2clogin.com/<your-tenant>.onmicrosoft.com/<your-policyID>`,
        authority: `https://${process.env.NEXT_PUBLIC_AZURE_AD_TENANT}.b2clogin.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT}.onmicrosoft.com/${process.env.NEXT_PUBLIC_AZURE_AD_SIGNUP_FLOW}`,
        // knownAuthorities: [`<your-tenant>.b2clogin.com`], // array of URIs that are known to be valid,
        knownAuthorities: [`${process.env.NEXT_PUBLIC_AZURE_AD_TENANT}.b2clogin.com`], // array of URIs that are known to be valid,
        validateAuthority: true,
        navigateToLoginRequestUrl: true,
    },
    cache: {
        // cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

console.debug('msalConfig', msalConfig);

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
    /*
    apiTodoList: {
        endpoint: 'http://localhost:5000/api/todolist',
        scopes: {
            read: ['https://fabrikamb2c.onmicrosoft.com/TodoList/ToDoList.Read'],
            write: ['https://fabrikamb2c.onmicrosoft.com/TodoList/ToDoList.ReadWrite'],
        },
    },
    */
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    // scopes: [...protectedResources.apiTodoList.scopes.read, ...protectedResources.apiTodoList.scopes.write],
    //scopes: [process.env.NEXT_PUBLIC_AZURE_AD_AUDIENCE, 'openid', 'profile', 'email'],
    scopes: [process.env.NEXT_PUBLIC_AZURE_AD_AUDIENCE, 'openid'],
    redirectUri: 'http://localhost:3000/',
};

export const msalInstance = new PublicClientApplication(msalConfig);
await msalInstance.initialize();

console.log('msalInstance', msalInstance);

export const login = async () => {
    try {
        return await msalInstance.loginPopup(loginRequest);
        // await msalInstance.loginRedirect(loginRequest);
    }
    catch(ex)
    {
        console.error('login error', ex);    
        return undefined;
    }
};
export const logout = async () => await msalInstance.logoutPopup();
