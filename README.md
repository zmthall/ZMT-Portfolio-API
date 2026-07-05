
```
ZMT-Portfolio-API
├─ dev-db-tools
│  └─ start-db-tunnel.js
├─ package-lock.json
├─ package.json
├─ src
│  ├─ app.ts
│  ├─ config
│  │  ├─ email.ts
│  │  ├─ firebase.ts
│  │  ├─ paths.ts
│  │  ├─ postgres.ts
│  │  ├─ recaptcha.ts
│  │  └─ url.ts
│  ├─ controllers
│  │  ├─ contact.controller.ts
│  │  ├─ email.controller.ts
│  │  └─ recaptcha.controller.ts
│  ├─ helpers
│  │  ├─ email
│  │  │  ├─ emailHelper.ts
│  │  │  ├─ emailer.ts
│  │  │  ├─ mainEmail.ts
│  │  │  └─ noReplyEmail.ts
│  │  ├─ firebaseHelpers.ts
│  │  ├─ postgres.ts
│  │  └─ safe.ts
│  ├─ logger.ts
│  ├─ middlewares
│  │  ├─ errorHandler.ts
│  │  ├─ routeLogs.ts
│  │  └─ verifyFirebaseToken.ts
│  ├─ routes
│  │  ├─ contact.route.ts
│  │  ├─ email.route.ts
│  │  ├─ index.ts
│  │  └─ recaptcha.route.ts
│  ├─ server.ts
│  ├─ services
│  │  ├─ contact.service.ts
│  │  ├─ email.service.ts
│  │  └─ recaptcha.service.ts
│  ├─ types
│  │  ├─ contact.ts
│  │  ├─ firebase.ts
│  │  ├─ nodemailer.ts
│  │  ├─ pagination.ts
│  │  └─ recaptcha.ts
│  └─ utils
│     ├─ contactSubmission.ts
│     └─ time.ts
├─ static
└─ tsconfig.json

```