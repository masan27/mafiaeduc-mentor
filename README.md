# Mafia Education Mentor

## Description

This is a web application that allows mentors to manage their class and schedule. It also allows mentors to create and have a student join their class. The application also allows students to view their class schedule and view their mentor's profile.

## Installation (Development)

1. Clone the repository
2. Install the dependencies
    ```bash
    npm install
    ```
3. Copy the `.env.example` file and rename it to `.env`
4. Set the api url in the `.env` file
5. Run the application
    ```bash
    npm run dev
    ```
6. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Prepare to deploy (Production)

1. Change the `.env` file
    ```bash
    VITE_MODE_ENV=production
    ```
2. Run the application
    ```bash
    npm run build
    ```

## Versioning

Mafia Education Mentor v1.0

-   Node JS: v18.17.1
-   NPM: v9.6.4
-   React JS: ^18.2.0
