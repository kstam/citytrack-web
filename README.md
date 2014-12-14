Citytrack-Web
==========

Contains the web client of the Citytrack project

Setup Environment and run the project
---

First you will need to install #node#.

Then run the following command

    ~> npm install -g bower gulp karma

Checkout the code and cd to the directory. There, run the following commands:

    ~> npm install
    ~> gulp

You are ready to start the server. Run:

    ~> gulp server:dev
    
or

    ~> node app.js

The first way of running the server is preferred when in development mode. 
This way all the files are being monitored for changes and compiled automatically. Also, the server
restarts if the backend code is changed. This way the development cycle is much faster.

Finally, open your browser and go to:

    ~> http://localhost:3000