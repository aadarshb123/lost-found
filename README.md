# lost&found


Setup: 
- Download node/npm: https://nodejs.org/en, git: https://git-scm.com/
- Run "npm install" separately in the lost-found directory, backend, and frontend to solve dependencies
- run "npm install express cors mongoose dotenv" in the backend folder
- cd into backend and create a .env file and add (PORT=5001) in the top line
  - .env stores all the confidential information like API keys and port numbers, so it doesnt get pushed up to github; therefore, everyone has to create their own file locally
- Also add JWT_SECRET into your .env file
  - Run this command to generate a JWT Token:
  ```
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- Add EMAIL_USER and EMAIL_PASS into your .env file
- Add CLIENT_URL=http://localhost:5173 into your .env file

To Run the App: 
- "npm run start" in the lost-found directory: I am using nodedemon, so this should run the backend and frontend concurrently

Some Helpful Things: 
- Enable autosaving on VS Code: its gonna be a pain in the ass to save your code everytime make changes and restart the app
- Use ChatGPT to help debug your dependency issues; it is incredibly helpful
- Ask for help: Harry, I, and all your team members are here if you ever get stuck on something!
