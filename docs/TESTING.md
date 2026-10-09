# Manual Testing Checklist

Tick each box as you go. "Expected" is what should happen; anything else is a bug worth noting.

## 0. Setup

Start these in three terminals (see the README for first-time setup):

```sh
cd server && npm run dev
cd client && npm run dev
cd desktop && YODA_POLL_MINUTES=0.2 YODA_HEALTH_MINUTES=2 YODA_FOCUS_MINUTES=0.3 YODA_BREAK_MINUTES=0.2 npm run dev
```

The short durations make reminders, breaks and the timer quick to test. Drop them for normal use.

- [ ] `curl localhost:3000/api/health` returns `{"status":"ok"}`
- [ ] The desktop app opens a main window **and** YODA in the bottom-right corner

## 1. Register and verify email

- [ ] Submit the register form empty. Expected: an error under each field
- [ ] Use a password shorter than 8 characters. Expected: "Password must be at least 8 characters."
- [ ] Register with real values. Expected: you land on "Check your email"
- [ ] In the **server** terminal, find the `[DEV EMAIL]` block with the 6-digit code
- [ ] Type a wrong code. Expected: "The code is wrong or has expired."
- [ ] "Send a new code" is disabled for 60 seconds, then works. Expected: a new code in the server terminal; the old one no longer works
- [ ] Type the correct code. Expected: you are logged in and see the empty agenda ("Nothing on your plate yet")
- [ ] Register again with the same email. Expected: "An account with this email already exists."

## 2. Log in and out

- [ ] Log out. Expected: back on the login page
- [ ] Log in with a wrong password. Expected: "Email or password is incorrect."
- [ ] Log in correctly. Expected: the agenda
- [ ] Refresh the page (Ctrl+R). Expected: still logged in
- [ ] Register a second account but do **not** verify it, then try to log in. Expected: you are sent to the verify page and a fresh code is printed

## 3. Agenda and tasks

- [ ] Click **+**. Expected: "New task" dialog with the title field focused
- [ ] Save with an empty title. Expected: "Title is required."
- [ ] Add a task with no deadline. Expected: it appears under "No deadline"
- [ ] Add tasks due today, tomorrow, in 4 days, in 2 weeks, and one in the past. Expected sections: Today, Tomorrow, Next 7 days, Later, Overdue (red, shows "x hours ago")
- [ ] Click a task's title. Expected: the edit dialog with its values filled in
- [ ] Change the title and deadline, save. Expected: it moves to the right section
- [ ] Use "Clear deadline", save. Expected: it moves to "No deadline"
- [ ] Tick the circle. Expected: the task moves to "Done" (collapsed, click to expand), title crossed out
- [ ] Untick it in "Done". Expected: it goes back to its section
- [ ] Open a task, click **Delete**, then **Yes, delete it**. Expected: it disappears
- [ ] Press **Esc** or click outside the dialog. Expected: it closes without saving
- [ ] Stop the server and tick a task. Expected: the tick rolls back and a red banner appears with "Try again"
- [ ] Shrink the window to phone width. Expected: everything still readable, no sideways scrolling

## 4. Desktop pet

- [ ] Hover YODA. Expected: it hops and its eyes turn into smiles; the faint × becomes clearly visible
- [ ] Click once. Expected: after a moment the timer panel opens; the window grows upward, YODA stays in place
- [ ] Click **Focus 25** (or the short test duration). Expected: countdown and progress bar move
- [ ] **Pause**, wait, **Resume**. Expected: the time continues from where it paused
- [ ] Let it finish. Expected: a chime, and the bubble says "Focus session done! Take a short break."; the panel is ready for a break
- [ ] Click once again. Expected: the timer panel closes and the window shrinks
- [ ] Double-click. Expected: an encouraging line in a speech bubble; the timer panel does **not** toggle
- [ ] Double-click several times quickly. Expected: messages show one after another, not on top of each other
- [ ] Click a bubble. Expected: it disappears immediately
- [ ] Focus YODA with Tab and press Enter. Expected: the timer panel opens (keyboard works)

## 5. Reminders

- [ ] Create a task due **3 hours and 2 minutes** from now. Within about 2 minutes, expected: a bubble like *Heads up! "Task" is due in 3 hours.* with YODA wiggling
- [ ] It does not repeat on the next poll
- [ ] With `YODA_HEALTH_MINUTES=2`, after 2 minutes expected: a break reminder ("Stand up and stretch!")
- [ ] Mark a task done before its reminder time. Expected: no reminder for it
- [ ] Log out in the desktop app. Expected: deadline reminders stop (health reminders continue)

## 6. Hidden pet and background mode

- [ ] Run `notify-send "test" "hello"` first to confirm your notification daemon works
- [ ] Click the × on YODA. Expected: YODA disappears; the main window button now says "Show pet"
- [ ] Start a short timer before hiding, or wait for a reminder. Expected: it arrives as a **system notification**, and the chime still plays when the timer ends
- [ ] Click **Show pet**. Expected: YODA comes back
- [ ] Close the main window. Expected: YODA and reminders keep working
- [ ] Run `npm run dev` in `desktop/` again (or launch the app again). Expected: the existing main window reappears; no second YODA
- [ ] Tray icon (if your bar has a tray): Open YODA, Show/Hide pet, Quit YODA all work
- [ ] Click **Quit YODA** in the main window. Expected: everything closes

## 7. Hyprland

- [ ] With the window rules from the README, YODA floats, stays on top of other windows and has no border or shadow
- [ ] Switch workspaces. Expected: YODA follows you (pin)
- [ ] `Super` + drag moves YODA

## 8. Built app

- [ ] `npm run build:client && npm run start:dist` in `desktop/` works like the dev version
- [ ] `npm run dist` creates `desktop/release/YODA-1.0.0.AppImage`; `chmod +x` it and run it

## 9. Web only

- [ ] Open http://localhost:5173 in a normal browser. Expected: register, login and the agenda work; no "Show pet" or "Quit YODA" buttons
- [ ] Open http://localhost:5173/#/pet. Expected: a preview of YODA with a local timer (no reminders in this mode)
