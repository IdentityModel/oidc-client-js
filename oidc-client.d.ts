declare module "oidc-client" {
    export = Oidc;
}
declare namespace Oidc {
    interface Logger  {
        error(message?: any, ...optionalParams: any[]): void;
        info(message?: any, ...optionalParams: any[]): void;
        warn(message?: any, ...optionalParams: any[]): void;
    }
    interface AccessTokenEvents {

        load(container: User): void;

        unload(): void;

        addAccessTokenExpiring(callback: (...ev: any[]) => void): void;
        removeAccessTokenExpiring(callback: (...ev: any[]) => void): void;

        addAccessTokenExpired(callback: (...ev: any[]) => void): void;
        removeAccessTokenExpired(callback: (...ev: any[]) => void): void;
    }
    interface InMemoryWebStorage {
        getItem(key: string): any;

        setItem(key: string, value: any): any;

        removeItem(key: string): any;

        key(index: number): any;

        length?: number;
    }
    class Log {
        static NONE: number;
        static ERROR: number;
        static WARN: number;
        static INFO: number;
        // For when TypeScript 2.0 compiler is more widely used
        // static readonly NONE: number;
        // static readonly ERROR: number;
        // static readonly WARN: number;
        // static readonly INFO: number;

        static reset(): void;

        static level: number;

        static logger: Logger;

        static info(message?: any, ...optionalParams: any[]): void;
        static warn(message?: any, ...optionalParams: any[]): void;
        static error(message?: any, ...optionalParams: any[]): void;
    }

    interface MetadataService {
        new (settings: OidcClientSettings): MetadataService;

        getMetadata(): Promise<any>;

        getIssuer(): Promise<any>;

        getAuthorizationEndpoint(): Promise<any>;

        getUserInfoEndpoint(): Promise<any>;

        getCheckSessionIframe(): Promise<any>;

        getEndSessionEndpoint(): Promise<any>;

        getSigningKeys(): Promise<any>;
    }
    interface MetadataServiceCtor {
        (settings: OidcClientSettings, jsonServiceCtor?: any): MetadataService;
    }
    interface ResponseValidator {
        validateSigninResponse(state: any, response: any): Promise<any>;
        validateSignoutResponse(state: any, response: any): Promise<any>;
    }
    interface ResponseValidatorCtor {
        (settings: OidcClientSettings, metadataServiceCtor?: MetadataServiceCtor, userInfoServiceCtor?: any): ResponseValidator;
    }

    class OidcClient {
        constructor(settings: OidcClientSettings);

        createSigninRequest(args?: any): Promise<any>;
        processSigninResponse(): Promise<any>;

        createSignoutRequest(args?: any): Promise<any>;
        processSignoutResponse(): Promise<any>;

        clearStaleState(stateStore: any): Promise<any>;
    }

    interface OidcClientSettings {
        authority?: string;
        metadataUrl?: string;
        metadata?: any;
        signingKeys?: any[];
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
        stateStore?: WebStorageStateStore;
        ResponseValidatorCtor?: ResponseValidatorCtor;
        MetadataServiceCtor?: MetadataServiceCtor;
    }

    class UserManager extends OidcClient {
        constructor(settings: UserManagerSettings);

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
        signoutPopup(args?: any): Promise<any>;

        querySessionStatus(args?: any): Promise<any>;

        events: UserManagerEvents;
    }
    interface UserManagerEvents extends AccessTokenEvents {
        load(user: User): any;
        unload(): any;

        addUserLoaded(callback: (...ev: any[]) => void): void;
        removeUserLoaded(callback: (...ev: any[]) => void): void;

        addUserUnloaded(callback: (...ev: any[]) => void): void;
        removeUserUnloaded(callback: (...ev: any[]) => void): void;

        addSilentRenewError(callback: (...ev: any[]) => void): void;
        removeSilentRenewError(callback: (...ev: any[]) => void): void;

        addUserSignedOut(callback: (...ev: any[]) => void): void;
        removeUserSignedOut(callback: (...ev: any[]) => void): void;
    }
    interface UserManagerSettings extends OidcClientSettings {
        popup_redirect_uri?: string;
        popupWindowFeatures?: string;
        popupWindowTarget?: any;
        silent_redirect_uri?: any;
        silentRequestTimeout?: any;
        automaticSilentRenew?: any;
        monitorSession?: any;
        checkSessionInterval?: any;
        revokeAccessTokenOnSignout?: any;
        accessTokenExpiringNotificationTime?: number;
        redirectNavigator?: any;
        popupNavigator?: any;
        iframeNavigator?: any;
        userStore?: any;
    }

    interface WebStorageStateStoreSettings {
        prefix?: string;
        store?: any;
    }

    class WebStorageStateStore {
        constructor(settings: WebStorageStateStoreSettings);

        set(key: string, value: any): Promise<void>;

        get(key: string): Promise<any>;

        remove(key: string): Promise<any>;

        getAllKeys(): Promise<string[]>;
    }
    interface User {
        id_token: string;
        session_state: any;
        access_token: string;
        token_type: string;
        scope: string;
        profile: any;
        expires_at: number;
        state: any;
        toStorageString(): string;

        expires_in: number;
        expired: boolean;
        scopes: string[];

        // For when TypeScript 2.0 compiler is more widely used
        // readonly expires_in: number;
        // readonly expired: boolean;
        // readonly scopes: string[];
    }
    class CordovaPopupWindow {
        constructor(params: any);
        navigate(params: any): Promise<any>;
        promise: Promise<any>;
    }
    class CordovaPopupNavigator {
        prepare(params: any): Promise<CordovaPopupWindow>;
    }
    class CordovaIFrameNavigator {
        prepare(params: any): Promise<CordovaPopupWindow>;
    }
}
