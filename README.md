# YODA(YOu're Doing Amazing)
We all have those times when we feel dull, bored, and lonely while doing our routine. Hours of sitting in front of a computer to code a project, write an essay, or even organize our work can turn into painful activities we wish we could do less. Burning out because of a boring workflow is not rare, so we created YODA (You're Doing Amazing). YODA is your routine buddy that helps you keep your mood up while still acing your deadlines.

## Features
YODA is a desktop pet that does incredible things to keep you happy while you're dealing with complicated and boring tasks.

- **Deadline reminders:** Add your deadlines, and YODA becomes your trustworthy time-management partner, reminding you even when you've lost track of time.
- **Focus timer:** YODA helps you create focus periods with a structured timer designed for time blocking.
- **Health reminders:** What kind of buddy would YODA be if it didn't care about your health? It reminds you to take breaks and keeps you going when you're on the verge of giving up.

![this is image](https://github.com/Rahi2208/routine-buddy/blob/main/docs/images/locked-in.jpg?raw=true)


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
