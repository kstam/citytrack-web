Citytrack-Web
==========

Contains the web client of the Citytrack project

Setup Environment and run the project
---

First you will need to install #node#.

The best way to install NodeJs is by using [nvm](https://github.com/creationix/nvm)

Then you will need to install Karma(Testing), Bower(Dependency Management) and Gulp(Build Tool). To do that, run the
following command

    $ npm install -g bower gulp karma

Checkout the code and cd to the directory. There, run the following commands:

    $ npm install
    $ gulp

You are ready to start the server.

For **Production**

    ~> node bin/www

For **Development**

    ~> gulp server:dev

This way of running the server is preferred when in development mode because all the files are being monitored for changes and compiled automatically.
Also, the server restarts if the backend code is changed. This way the development cycle is much faster.

Finally, open your browser and go to:

    ~> http://localhost:3000


###FAQ

####Why is leaflet both in Bower and in NPM dependencies?



