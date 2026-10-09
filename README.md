# YODA(YOu're Doing Amazing)
We have all those time when we feel dull, boring and lonely when doing your routine. Hours of sitting in front of your computer to code a project, writing an essay, or even organizing your work has become a painfully activities that you pray to do less. Burned out because of a boring workflow is not a rare thing to occur, so we create a YODA (You're Doing Amazing), YODA is your routine buddy that will helps you maintain your mood while still helps you ace your deadlines. 

## Features
It is a desktop pet that can do incredible things to keep you happy while you dealing with complicated and boring tasks. 
- By adding deadlines, YODA pet can be your trustworty partner for your time management, by constantly reminding you even when you are not aware of it.
- it also creating a focus period for you by providing interesting and structured timer specially design for time blocking
-  and what is a good buddy when it doesn't care for your health and keep you going while you at the tip of giving up.

![this is image](https://github.com/Rahi2208/routine-buddy/blob/main/LOCK%20IN%20_%20EXAM%20PREPARATION%20_.jpg)


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express |
| Database | PostgreSQL, Prisma ORM |
| Auth | bcrypt (password hashing), JWT |
| Desktop | Electron |
| Tools | Git, GitHub |

## Folder Structure

```
yoda/
├── server/    # Backend: REST API, business logic, database
├── client/    # Frontend: React UI for the main app and the desktop pet
└── desktop/   # Electron: desktop app, pet window, timers, reminders, notifications
```

### server/

```
server/
├── prisma/          # database schema and migrations
└── src/
    ├── routes/      # API endpoints (URLs)
    ├── controllers/ # handle requests and responses
    ├── services/    # business logic (e.g. reminder scheduling)
    ├── middlewares/ # auth check, error handling
    └── utils/       # small reusable helpers
```

### client/

```
client/src/
├── api/        # functions that call the backend
├── pages/      # Register, Verify Email, Login, Main
├── components/ # UI pieces for the main page
├── pet/        # desktop pet UI (pet, speech bubble, timer panel)
└── hooks/      # reusable React logic
```

### desktop/

```
desktop/src/
├── windows/     # main window and pet window
├── engine/      # timer, deadline reminders, health reminders
├── notifier.js  # show message in pet bubble or as OS notification
└── preload.js   # secure bridge between Electron and React
```

##How to Use 
coming soon. . .
