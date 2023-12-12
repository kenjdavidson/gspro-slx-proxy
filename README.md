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

## Development

### Install dependencies

```
$ npm install
```

### Run app in dev mode

```
$ npm run dev
```

### Lint files

```
$ npm run lint
```

### Perform typecheck

```
$ npm run typecheck:main
$ npm run typecheck:preload
$ npm run typecheck:renderer
```

### Build and package app

```
$ npm build && pnpm package
```
