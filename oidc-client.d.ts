// Type definitions for oidc-client v1.1.0
// Project: https://github.com/IdentityModel/oidc-client-js
// Definitions by: Brock Allen <https://github.com/brockallen>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare var UserManager: Oidc.UserManager;
declare var OidcClient: Oidc.OidcClient;
declare var AccessTokenEvents: Oidc.AccessTokenEvents;
declare var Log: Oidc.Log;
declare var InMemoryWebStorage: Oidc.InMemoryWebStorage;
declare var MetadataService: Oidc.MetadataService;
declare var WebStorageStateStore: Oidc.WebStorageStateStore;

declare module "oidc-client" {
    export = Oidc;
}

declare namespace Oidc {
    class Error {
        message: string;
    }

    class Promise<T> {
        constructor(promise: any);
        then(successCallback: (value?: T) => void, errorCallback: (err?: Error) => void): Promise<T>;
        catch(errorCallback: (err:Error) => void): Promise<T>;
    }
    
    interface AccessTokenEvents {

        load(container);

        unload();

        addAccessTokenExpiring(callback:(ev:any) => void);
        removeAccessTokenExpiring(callback:(ev:any) => void);

        addAccessTokenExpired(callback:(ev:any) => void);
        removeAccessTokenExpired(callback:(ev:any) => void);
    }
    interface InMemoryWebStorage {
        getItem(key: string);

        setItem(key: string, value: any);

        removeItem(key: string);

        key(index: number);

        length?: number;
    }
    interface Log {
        NONE();
        ERROR();
        WARN();
        INFO();

        reset();

        level(value);

        logger(value);

        info(...args);
        warn(...args);
        error(...args);
    }

    interface MetadataService {
        new (settings: any);
        getMetadata();

        getIssuer();

        getAuthorizationEndpoint();

        getUserInfoEndpoint();

        getCheckSessionIframe();

        getEndSessionEndpoint();

        getSigningKeys();
    }
    interface OidcClient {
        new (settings: OidcClientCtor);

        createSigninRequest(args?: any): Promise<any>;
        processSigninResponse(): Promise<any>;

        createSignoutRequest(args?: any): Promise<any>;
        processSignoutResponse(): Promise<any>;

        clearStaleState(stateStore: any): Promise<any>;
    }

    interface OidcClientCtor {
        authority?: string;
        metadataUrl?: string;
        metadata?: any;
        signingKeys?: string;
        client_id?: string;
        response_type?: string;
        scope?: string;
        redirect_uri?: string;
        post_logout_redirect_uri?: string;
        prompt?: string;
        display?: string;
        max_age?: number;
        ui_locales?: string;
        acr_values?: string;
        filterProtocolClaims?: boolean;
        loadUserInfo?: boolean;
        staleStateAge?: number;
        clockSkew?: number;
        stateStore?: any;
        ResponseValidatorCtor?: any;
        MetadataServiceCtor?: any;
    }

    interface UserManager extends OidcClient {
        new (settings: UserManagerCtor);

        clearStaleState(): Promise<void>;

        getUser(): Promise<User>;
        removeUser(): Promise<void>;

        signinPopup(args?: any): Promise<User>;
        signinPopupCallback(url?: string): Promise<any>;

        signinSilent(args?: any): Promise<User>;
        signinSilentCallback(url?: string): Promise<any>;

        signinRedirect(args?: any): Promise<any>;
        signinRedirectCallback(url?: string): Promise<User>;

        signoutRedirect(args?: any): Promise<any>;
        signoutRedirectCallback(url?: string): Promise<any>;

        querySessionStatus(args?: any): Promise<any>;

        events: UserManagerEvents;
    }
    interface UserManagerEvents extends AccessTokenEvents {
        load(user: User);
        unload();

        addUserLoaded(callback:(ev:any) => void);
        removeUserLoaded(callback:(ev:any) => void);

        addUserUnloaded(callback:(ev:any) => void);
        removeUserUnloaded(callback:(ev:any) => void);

        addSilentRenewError(callback:(ev:any) => void);
        removeSilentRenewError(callback:(ev:any) => void);

        addUserSignedOut(callback:(ev:any) => void);
        removeUserSignedOut(callback:(ev:any) => void);
    }
    interface UserManagerCtor extends OidcClientCtor {
        popup_redirect_uri?: string;
        popupWindowFeatures?: string;
        popupWindowTarget?: any;
        silent_redirect_uri?: any;
        automaticSilentRenew?: any;
        accessTokenExpiringNotificationTime?: string;
        redirectNavigator?: any;
        popupNavigator?: any;
        iframeNavigator?: any;
        userStore?: any;
    }
    interface WebStorageStateStore {
        set(key: string, value: any);

        get(key: string);

        remove(key: string);

        getAllKeys();
    }
    interface User {
        id_token: string;
        session_state: any;
        access_token: string;
        token_type: string;
        scope: string;
        profile: any;
        expires_at: any;
        state: any;
        toStorageString(storageString?: any);
    }
}
