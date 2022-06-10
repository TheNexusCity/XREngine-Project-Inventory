## In Progress

This is a project that enables a database or blockchain backed inventory system. It provides the database tables, feathersjs services, user table integration, UI components and optional Blockchain-in-a-box connectivity.

The code currently exists in a partially implemented state, there are missing pieces and it needs a big re-thinking and refactor.

The previous implementation can be found here: https://github.com/XRFoundation/XREngine/pull/5070

## Getting started

- git clone `https://github.com/TheNexusCity/XREngine`
- cd XREngine folder and run npm install


- git clone `https://github.com/TheNexusCity/XREngine-Project-Inventory` under the `XREngine/packages/projects/projects` folder.

- cd `XREngine/packages/projects/projects/XREngine-Project-Inventory`

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