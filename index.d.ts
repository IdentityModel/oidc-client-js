/* Provides a namespace for when the library is loaded outside a module loader environment */
export as namespace Oidc;

export interface Logger {
  error(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  debug(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
}

export interface AccessTokenEvents {

  load(container: User): void;

  unload(): void;

  addAccessTokenExpiring(callback: (...ev: any[]) => void): void;
  removeAccessTokenExpiring(callback: (...ev: any[]) => void): void;

  addAccessTokenExpired(callback: (...ev: any[]) => void): void;
  removeAccessTokenExpired(callback: (...ev: any[]) => void): void;
}

export class InMemoryWebStorage {
  getItem(key: string): any;

  setItem(key: string, value: any): any;

  removeItem(key: string): any;

  key(index: number): any;

  length?: number;
}

export class Log {
  static readonly NONE: number;
  static readonly ERROR: number;
  static readonly WARN: number;
  static readonly INFO: number;
  static readonly DEBUG: number;

  static reset(): void;

  static level: number;

  static logger: Logger;

  static debug(message?: any, ...optionalParams: any[]): void;
  static info(message?: any, ...optionalParams: any[]): void;
  static warn(message?: any, ...optionalParams: any[]): void;
  static error(message?: any, ...optionalParams: any[]): void;
}

export interface MetadataService {
  new (settings: OidcClientSettings): MetadataService;

  metadataUrl?: string;

  getMetadata(): Promise<OidcMetadata>;

  getIssuer(): Promise<string>;

  getAuthorizationEndpoint(): Promise<string>;

  getUserInfoEndpoint(): Promise<string>;

  getTokenEndpoint(): Promise<string | undefined>;

  getCheckSessionIframe(): Promise<string | undefined>;

  getEndSessionEndpoint(): Promise<string | undefined>;

  getRevocationEndpoint(): Promise<string | undefined>;

  getKeysEndpoint(): Promise<string | undefined>;

  getSigningKeys(): Promise<any[]>;
}

export interface MetadataServiceCtor {
  (settings: OidcClientSettings, jsonServiceCtor?: any): MetadataService;
}

export interface ResponseValidator {
  validateSigninResponse(state: any, response: any): Promise<SigninResponse>;
  validateSignoutResponse(state: any, response: any): Promise<SignoutResponse>;
}

export interface ResponseValidatorCtor {
  (settings: OidcClientSettings, metadataServiceCtor?: MetadataServiceCtor, userInfoServiceCtor?: any): ResponseValidator;
}

export interface SigninRequest {
  url: string;
  state: any;
}

export interface SignoutRequest {
  url: string;
  state?: any;
}

export class OidcClient {
  constructor(settings: OidcClientSettings);

  readonly settings: OidcClientSettings;

  createSigninRequest(args?: any): Promise<SigninRequest>;
  processSigninResponse(url?: string, stateStore?: StateStore): Promise<SigninResponse>;

  createSignoutRequest(args?: any): Promise<SignoutRequest>;
  processSignoutResponse(url?: string, stateStore?: StateStore): Promise<SignoutResponse>;

  clearStaleState(stateStore: StateStore): Promise<any>;

  readonly metadataService: MetadataService;
}

export interface OidcClientSettings {
  authority?: string;
  readonly metadataUrl?: string;
  metadata?: any;
  signingKeys?: any[];
  client_id?: string;
  client_secret?: string;
  readonly response_type?: string;
  readonly response_mode?: string;
  readonly scope?: string;
  readonly redirect_uri?: string;
  readonly post_logout_redirect_uri?: string;
  readonly popup_post_logout_redirect_uri?: string;
  readonly prompt?: string;
  readonly display?: string;
  readonly max_age?: number;
  readonly ui_locales?: string;
  readonly acr_values?: string;
  readonly filterProtocolClaims?: boolean;
  readonly loadUserInfo?: boolean;
  readonly staleStateAge?: number;
  readonly clockSkew?: number;
  readonly stateStore?: StateStore;
  ResponseValidatorCtor?: ResponseValidatorCtor;
  MetadataServiceCtor?: MetadataServiceCtor;
  extraQueryParams?: {};
}

export class UserManager extends OidcClient {
  constructor(settings: UserManagerSettings);

  readonly settings: UserManagerSettings;

  clearStaleState(): Promise<void>;

  getUser(): Promise<User>;
  storeUser(user:User): Promise<void>;
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
  signoutPopupCallback(url?: string, keepOpen?: boolean): Promise<void>;
  signoutPopupCallback(keepOpen?: boolean): Promise<void>;

  querySessionStatus(args?: any): Promise<any>;

  revokeAccessToken(): Promise<void>;

  startSilentRenew(): void;
  stopSilentRenew(): void;

  events: UserManagerEvents;
}

export interface UserManagerEvents extends AccessTokenEvents {
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

  addUserSessionChanged(callback: (...ev: any[]) => void): void;
  removeUserSessionChanged(callback: (...ev: any[]) => void): void;
}

export interface UserManagerSettings extends OidcClientSettings {
  readonly popup_redirect_uri?: string;
  readonly popupWindowFeatures?: string;
  readonly popupWindowTarget?: any;
  readonly silent_redirect_uri?: any;
  readonly silentRequestTimeout?: any;
  readonly automaticSilentRenew?: boolean;
  readonly includeIdTokenInSilentRenew?: boolean;
  readonly monitorSession?: boolean;
  readonly checkSessionInterval?: number;
  readonly query_status_response_type?: string;
  readonly stopCheckSessionOnError?: boolean;
  readonly revokeAccessTokenOnSignout?: any;
  readonly accessTokenExpiringNotificationTime?: number;
  readonly redirectNavigator?: any;
  readonly popupNavigator?: any;
  readonly iframeNavigator?: any;
  readonly userStore?: any;
}

export interface WebStorageStateStoreSettings {
  prefix?: string;
  store?: any;
}

export interface StateStore {
  set(key: string, value: any): Promise<void>;

  get(key: string): Promise<any>;

  remove(key: string): Promise<any>;

  getAllKeys(): Promise<string[]>;
}

export class WebStorageStateStore implements StateStore {
  constructor(settings: WebStorageStateStoreSettings);

  set(key: string, value: any): Promise<void>;

  get(key: string): Promise<any>;

  remove(key: string): Promise<any>;

  getAllKeys(): Promise<string[]>;
}

export interface SigninResponse {
  new (url: string): SigninResponse;

  access_token: string;
  error: string;
  error_description: string;
  error_uri: string;
  expires_at: number;
  id_token: string;
  profile: any;
  scope: string;
  session_state: any;
  state: any;
  token_type: string;

  readonly expired: boolean | undefined;
  readonly expires_in: number | undefined;
  readonly isOpenIdConnect: boolean;
  readonly scopes: string[];
}

export interface SignoutResponse {
  new (url: string): SignoutResponse;

  error: string;
  error_description: string;
  error_uri: string;
  state: any;
}

export class User {
  constructor(response: SigninResponse);

  id_token: string;
  session_state: any;
  access_token: string;
  token_type: string;
  scope: string;
  profile: any;
  expires_at: number;
  state: any;
  toStorageString(): string;

  readonly expires_in: number | undefined;
  readonly expired: boolean | undefined;
  readonly scopes: string[];
}

export class CordovaPopupWindow {
  constructor(params: any);
  navigate(params: any): Promise<any>;
  promise: Promise<any>;
}

export class CordovaPopupNavigator {
  prepare(params: any): Promise<CordovaPopupWindow>;
}

export class CordovaIFrameNavigator {
  prepare(params: any): Promise<CordovaPopupWindow>;
}


export interface OidcMetadata {
  issuer: string;
  authorization_endpoint:string;
  token_endpoint: string;
  token_endpoint_auth_methods_supported:string[];
  token_endpoint_auth_signing_alg_values_supported: string[];
  userinfo_endpoint: string;
  check_session_iframe: string;
  end_session_endpoint: string;
  jwks_uri: string;
  registration_endpoint: string;
  scopes_supported: string[];
  response_types_supported: string[];
  acr_values_supported: string[];
  subject_types_supported: string[];
  userinfo_signing_alg_values_supported: string[];
  userinfo_encryption_alg_values_supported: string[];
  userinfo_encryption_enc_values_supported: string[];
  id_token_signing_alg_values_supported: string[];
  id_token_encryption_alg_values_supported: string[];
  id_token_encryption_enc_values_supported: string[];
  request_object_signing_alg_values_supported: string[];
  display_values_supported: string[];
  claim_types_supported: string[];
  claims_supported: string[];
  claims_parameter_supported: boolean;
  service_documentation: string;
  ui_locales_supported: string[];

  revocation_endpoint: string;
  introspection_endpoint: string;
  frontchannel_logout_supported: boolean;
  frontchannel_logout_session_supported: boolean;
  backchannel_logout_supported: boolean;
  backchannel_logout_session_supported: boolean;
  grant_types_supported: string[];
  response_modes_supported: string[];
  code_challenge_methods_supported: string[];
}

export interface CheckSessionIFrame {
  new (callback: () => void, client_id: string, url: string, interval?: number, stopOnError?: boolean): CheckSessionIFrame

  load(): Promise<void>;

  start(session_state: string): void;

  stop(): void;
}

export interface CheckSessionIFrameCtor {
  (callback: () => void, client_id: string, url: string, interval?: number, stopOnError?: boolean): CheckSessionIFrame;
}

export class SessionMonitor {
  constructor(userManager: UserManager, CheckSessionIFrameCtor: CheckSessionIFrameCtor);
}
