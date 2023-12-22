# GSPro SLX Proxy

To resolve some issues and provide some features this application can be configured to act as a proxy between the [SLX Connect](https://support.swinglogic.us/hc/en-us) and [GSPConnector](https://gsprogolf.com/GSProConnectV1.html).

## Primary Issue

The primary issue is that during game play, after selecting a new club, the SLX Connect widget sends an invalid `BallData`/`ClubData` message to GSPro, in doing so, GSPro will ignore the message and send a reset connect message back to the SLX. This reset method will reset the club selection to the originally provided club.

### Example

This issue pops up:

-   Playing a hole (170 yards) GSPro initial message states the club is `5 iron`.
-   Attempt to select a new club, `6 iron` for example.
-   GSPro will reset the club selection back to `5 iron`.

> Some club changes work, the issue is more prevelant on par 3s for some reason.

### Screenshots

> Todo

## Contribution

Feel free to:

- Open any issues/requests for bugs/features
- Pull Requests with added features/bug fixes
- Fork to your hearts content to get working

Pretty straight forward to get started:

### Getting the app started

```
$ npm install
$ npm run dev
```

### Running tests

Test are separated into `nodejs` and `frontend`; which can be run using the following:

```
$ npm run test
$ npm run testui
```

> Both of which have a `:watch` alternative.  I suggest/recommend adding tests openning a pull request.

### Lint / Typecheaking

```
$ npm run lint
$ npm run typecheck:main
$ npm run typecheck:preload
$ npm run typecheck:renderer
```

### Build and package app

```
$ npm build && npm package
```

