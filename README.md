# bcrypt-repro

A minimal Meteor 3.5 test app used to reproduce native `bcrypt` behavior on the
server (native module builds, `accounts-password` interaction, deployment to
Galaxy).

On startup, [server/main.js](server/main.js) hashes a test string with
`bcrypt@5.1.1` and logs the first characters of the resulting hash, so a
successful boot means the native module loaded and ran.

## Requirements

- [Meteor](https://www.meteor.com/) 3.5
- Node toolchain able to build native modules (`bcrypt` ships prebuilds, but may
  compile from source on some platforms)

## Run

```bash
meteor npm install
npm start
```

Then open http://localhost:3000. The server log should show:

```
bcrypt OK: $2b$10$...
```

## Test

```bash
npm test        # single run, mocha driver
npm run test-app # full-app tests, watch mode
```

## Layout

- [client/](client/) — static page shell and client entrypoint
- [server/](server/) — startup hook with the bcrypt check and server-side render
- [tests/](tests/) — mocha tests
