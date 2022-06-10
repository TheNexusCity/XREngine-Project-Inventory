## In Progress

This is a project that enables a database or blockchain backed inventory system. It provides the database tables, feathersjs services, user table integration, UI components and optional Blockchain-in-a-box connectivity.

The code currently exists in a partially implemented state, there are missing pieces and it needs a big re-thinking and refactor.

The previous implementation can be found here: https://github.com/XRFoundation/XREngine/pull/5070

## Getting started

- git clone `https://github.com/TheNexusCity/XREngine`
- cd XREngine folder and run npm install


- git clone `https://github.com/TheNexusCity/XREngine-Project-Inventory` under the `XREngine/packages/projects/projects` folder.

- cd `XREngine/packages/projects/projects/XREngine-Project-Inventory` and run `code .` to open new window. 

Go back to the XREngine root folder and run `npm run install-projects` to install the project XREngine-Project-Inventory .

## To run XREngine project

### To start server

- cd script run `sudo docker-compose up` and `sudo bash start-agones.sh` to start agones server.

- cd packages/server 
   run `npm run dev-reinit-db`

- cd XREngine/packages/server 
   run `npm run dev`

### To start Client

- cd XREngine/packages/client 
   run `npm run dev`

### To run the project

- `https://localhost:3000/`
    
- `https://localhost:3000/admin` however make sure you are an admin to activate some routes.

- `https://localhost:3000/inventory` to access inventory page.
- `https://localhost:3000/trading` to access trading page.
- `https://localhost:3000/wallet` to activate wallet page.

### To use plug wallet

- Make sure to install `plug wallet` extension to load the data.
- If you visit the `https://localhost:3000/inventory` the plug wallet will appear and it use the imported wallet. 
