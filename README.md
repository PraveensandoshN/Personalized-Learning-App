# Personalized Learning Portal (Front-End)

A neat, professional, glossy two-page front-end demo.

## Flow
1. `index.html` is the login page (first screen).
2. After successful authentication, user is redirected to `dashboard.html`.
3. Dashboard layout:
   - Left side: list of subjects for students to choose.
   - Right side: recommended subjects based on selected interests.
4. If user is not authenticated, direct access to dashboard is blocked and redirected back to login.

## Credentials (as requested)
- Username: `user`
- Password: `passs`

## Run
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000`.
