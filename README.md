Citytrack-Web
==========

Contains the web client of the Citytrack project

Setup Environment and run the project
---

First you will need to install #node#.

The best way to install NodeJs is by using [nvm](https://github.com/creationix/nvm)

Then you will need to install Karma(Testing), Bower(Dependency Management), Gulp(Build Tool) and Forever. To do that, run the
following command

    $ npm install -g bower gulp karma forever

Checkout the code and cd to the directory. There, run the following commands:

    $ npm install
    $ gulp

You are ready to start the server.

For **Production**

    ~> node server.js > node.log &

For **Development**

    ~> gulp server:dev

This way of running the server is preferred when in development mode because all the files are being monitored for changes and compiled automatically.
Also, the server restarts if the backend code is changed. This way the development cycle is much faster.

Finally, open your browser and go to:

    ~> http://localhost:3000


### How to setup and deploy the webapp:

For this we will use [forever](https://github.com/foreverjs/forever) in combination with Upstart of Ubuntu.

Used the reply from [here](http://stackoverflow.com/questions/11084279/node-js-setup-for-easy-deployment-and-updating)

Also regarding users: [check this article](http://stackful-dev.com/what-every-developer-needs-to-know-about-ubuntu-upstart.html)

###FAQ

####Why is leaflet both in Bower and in NPM dependencies?



