# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/pusher/pusher-platform-node/compare/0.15.5...HEAD)

## [0.15.5](https://github.com/pusher/pusher-platform-node/compare/0.15.4...HEAD)

- Correct handling of JSON parsing errors

## [0.15.4](https://github.com/pusher/pusher-platform-node/compare/0.15.3...0.15.4)

- Set connection keep-alive to forever.

## [0.15.3](https://github.com/pusher/pusher-platform-node/compare/0.15.2...0.15.3)

- Remove unnecessary use of extend package

## [0.15.2](https://github.com/pusher/pusher-platform-node/compare/0.15.1...0.15.2) - 2018-11-19

- Adopt package in to the pusher org as `@pusher/platform-node`

## [0.15.1](https://github.com/pusher/pusher-platform-node/compare/0.15.0...0.15.1) - 2018-10-31

- Update dependencies

## [0.15.0](https://github.com/pusher/pusher-platform-node/compare/0.14.0...0.15.0) - 2018-10-31

### Changes

- `useQueryString` is now an optional property of `RequestOptions` and defaults to false
- The npm package has been tidied up to only include what is required
- Removed body-parser as a dependency as it's not required

## [0.14.0](https://github.com/pusher/pusher-platform-node/compare/0.13.2...0.14.0) - 2018-09-18

### Changes

- *Breaking*: An instance of `SDKInfo` is now required when instantiating an instance of `BaseClient`. This can either be directly provided to the `BaseClient` and then the base client provided to an instance of `Instance` in the `client` key or the `options` object that `Instance`s initializer takes, or you can provide the `SDKInfo` instance to the `Instance` initializer in the `sdkInfo` key of its `options` parameter
- Removed defaulting to generating a JWT with the `su: true` claim if no JWT is provided to a call to `request`

## [0.13.2](https://github.com/pusher/pusher-platform-node/compare/0.13.1...0.13.2) - 2018-08-17

### Additions

- `RequestOption` now exposes a `useQuerystring` attribute that can be used to specify if `query-string` library should be used to parse query string

## [0.13.1](https://github.com/pusher/pusher-platform-node/compare/0.13.0...0.13.1) - 2018-07-25

### Changes

- Bump verion of `jsonwebtoken`

## [0.13.0](https://github.com/pusher/pusher-platform-node/compare/0.12.1...0.13.0) - 2018-04-19

### Additions

- `authenticateWithRefreshToken` has been added if you want to support the `refresh_token` grant type and return refresh tokens as part of the authentication process

### Changes

- `authenticate` no longer returns a `refresh_token` and no longer accepts the `refresh_token` grant type
- Calls to `authenticate` and `authenticateWithRefreshToken` always return an `AuthenticationResponse` that looks like this:

```js
{
  status: number;
  headers: Headers;
  body: TokenResponse | ErrorBody;
}
```

where:

* `status` is the suggested HTTP response status code,
* `headers` are the suggested response `headers`,
* `body` holds either the token payload or an appropriate error payload.

Here is an example of the expected usage, simplified for brevity:

```js
app.post('/', function (req, res) {
  const authPayload = pusher.authenticate(req.body, {});
  res.status(authPayload.status).send(authPayload.body);
});
```

## [0.12.1](https://github.com/pusher/pusher-platform-node/compare/0.12.0...0.12.1) - 2018-04-05

### Fixes

- Issuer check in refresh token validation now checks that the issuer starts with `api_keys/`, not `keys/`

## [0.12.0](https://github.com/pusher/pusher-platform-node/compare/0.11.1...0.12.0) - 2018-03-29

### Changes

- `grant_type` is now required in `AuthenticatePayload`
- `AuthenticatePayload` is now exported from `index.js`

## [0.11.1](https://github.com/pusher/pusher-platform-node/compare/0.11.0...0.11.1) - 2018-01-26

### Changes

- Tokens now use `instance` claim instead of `app` claim

## [0.11.0](https://github.com/pusher/pusher-platform-node/compare/0.10.0...0.11.0) - 2018-01-26

### Changes

- Added support for custom token expiry with a `tokenExpiry` key in `AuthenticateOptions`
- Removed all mention of `tokenLeeway`

## [0.10.0](https://github.com/pusher/pusher-platform-node/compare/0.9.0...0.10.0) - 2017-10-27

### Changes

- When instantiating an `Instance` you now provide a `locator` instead of an `instanceId`

## [0.9.0](https://github.com/pusher/pusher-platform-node/compare/0.8.3...0.9.0) - 2017-09-20

### Changes

- Error responses now provide more information

## [0.8.3](https://github.com/pusher/pusher-platform-node/compare/0.8.2...0.8.3) - 2017-08-29

### Changes

- Corrected the error when instantiating the library - it now says it requires `instanceId` instead of `instance` field

## [0.8.2](https://github.com/pusher/pusher-platform-node/compare/0.8.1...0.8.2) - 2017-08-04

### Changes

- Added support for query params in `RequestOptions` (pass in an object undert the `qs` key)

## [0.8.1](https://github.com/pusher/pusher-platform-node/compare/0.3.0...0.8.1) - 2017-08-02

### Changes

- Move path sanitization logic all to the `BaseClient`
- `TokenWithExpiry` is now an exported interface.

## [0.8.0](https://github.com/pusher/pusher-platform-node/compare/0.7.1...0.8.0) - 2017-07-19

### Changes

- Renamed the `instance` to `instanceId` when instantiating an `Instance`
- `Instance` class now has a parameter `id` that used to be `instance`

## [0.7.1](https://github.com/pusher/pusher-platform-node/compare/0.7.0...0.7.1) - 2017-07-18

### Changes

- Requests now return a body as well

## [0.7.0](https://github.com/pusher/pusher-platform-node/compare/0.6.1...0.7.0) - 2017-07-17

### Fixes

- Fixed the issue with path - requests now work again

### Changes

- Removed `generateSuperUserJWT` in `Instance`
- Allow `Authenticator` to take in custom `tokenExpiry` and `tokenLeeway` - for SuperUser requests
- Rename exported `TOKEN_EXPIRY` to `DEFAULT_TOKEN_EXPIRY`

## [0.6.1](https://github.com/pusher/pusher-platform-node/compare/0.6.0...0.6.1) - 2017-07-11

### Changes

- Service claims are now optional

## [0.6.0](https://github.com/pusher/pusher-platform-node/compare/0.5.0...0.6.0) - 2017-07-10

### Changes

- Changed the artifact name to `pusher-platform-node`
- Renamed `App` to `Instance`, `appId` to `instanceId`
- Updated the tenancy to the upcoming standard: https://cluster.and.host/services/serviceName/serviceVersion/instanceId/...


_.. prehistory_
