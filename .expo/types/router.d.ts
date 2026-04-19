/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/agenda` | `/agenda`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/games` | `/games`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/learn` | `/learn`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/rewards` | `/rewards`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/agenda` | `/agenda`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/games` | `/games`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/learn` | `/learn`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/rewards` | `/rewards`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/agenda${`?${string}` | `#${string}` | ''}` | `/agenda${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/games${`?${string}` | `#${string}` | ''}` | `/games${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/learn${`?${string}` | `#${string}` | ''}` | `/learn${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/rewards${`?${string}` | `#${string}` | ''}` | `/rewards${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/agenda` | `/agenda`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/games` | `/games`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/learn` | `/learn`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/rewards` | `/rewards`; params?: Router.UnknownInputParams; };
    }
  }
}
