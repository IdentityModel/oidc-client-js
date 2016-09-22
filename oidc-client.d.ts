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

    interface AccessTokenEvents {

        load(container: any): any;

        unload(): any;

        addAccessTokenExpiring(callback: (ev: any) => void): any;
        removeAccessTokenExpiring(callback: (ev: any) => void): any;

        addAccessTokenExpired(callback: (ev: any) => void): any;
        removeAccessTokenExpired(callback: (ev: any) => void): any;
    }
    interface InMemoryWebStorage {
        getItem(key: string): any;

        setItem(key: string, value: any): any;

        removeItem(key: string): any;

        key(index: number): any;

        length?: number;
    }
    interface Log {
        NONE(): number;
        ERROR(): number;
        WARN(): number;
        INFO(): number;

        reset(): void;

        level(value: number): number;

        logger(value: any): any;

        info(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
    }

    interface MetadataService {
        new (settings: any): any;
        getMetadata(): any;

        getIssuer(): any;

        getAuthorizationEndpoint(): any;

        getUserInfoEndpoint(): any;

        getCheckSessionIframe(): any;

        getEndSessionEndpoint(): any;

        getSigningKeys(): any;
    }
    interface OidcClient {
        new (settings: OidcClientCtor): any;

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
        new (settings: UserManagerCtor): any;

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
        load(user: User): any;
        unload(): any;

        addUserLoaded(callback: (ev: any) => void): any;
        removeUserLoaded(callback: (ev: any) => void): any;

        addUserUnloaded(callback: (ev: any) => void): any;
        removeUserUnloaded(callback: (ev: any) => void): any;

        addSilentRenewError(callback: (ev: any) => void): any;
        removeSilentRenewError(callback: (ev: any) => void): any;

        addUserSignedOut(callback: (ev: any) => void): any;
        removeUserSignedOut(callback: (ev: any) => void): any;
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
        set(key: string, value: any): any;

        get(key: string): any;

        remove(key: string): any;

        getAllKeys(): any;
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
        toStorageString(storageString?: any): any;
    }
}
