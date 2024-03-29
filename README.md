# Welcome to CCASM!

The ultimate goal of the Canadian Collection of Agricultural Soil Microbes (CCASM) is to store microbe sample information collected by researchers around Canada. Researchers have already foregone collecting data, and will continue to do so in the future, but there is no centralized solution for sharing, storing or managing this data. Our application is meant to fill that gap by creating a web portal where researchers can browse the catalog of samples as well as request physical samples of the microbe

## Installation Guide

Clone the CCASM repository on to your local machine.
`$ git clone git@github.com:jppp6/CCASM.git`

Install the necessary packages
`$ sudo apt install nodejs`
`$ sudo apt install npm`
[NodeJS and NPM Installation Guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

`$ npm install -g @angular/cli@16`
[Angular Installation Guide](https://angular.io/guide/setup-local)

> Python usually comes pre installed on computers, but if not follow this guide:
> [https://www.python.org/downloads/](https://www.python.org/downloads/)

> You may want to install a node version manager, NVM is good
> (this allows to change which version of node is used easily)
> [Install NVM](https://github.com/nvm-sh/nvm)

---

Change directories into ~/CCASM/frontend
`$ cd ~/CCASM/frontend`

Then install all the dependencies
`$ npm install`

> Make sure to be using Node V18.17.1

Once that is done, you can start the dev server on
`$ npm start`

> You should now see the CCASM frontend running on localhost:4200/

---

Change directories into CCASM/backend
`$ cd ~/CCASM/backend`

Create a virtual environment and activate it
`$ python3 -m venv env`
`$ source env/bin/activate`

Install all the dependencies
`$ pip install -r requirements.txt`

**!Don't forget to populate the .env file for storing API keys + passwords.**

Start the Django development sever by running
`$ python3 src/manage.py runserver 8000`

> You should now see the CCASM backend running on localhost:8000/

## Deployment

To deploy a new version of CCASM on the server, make your way to the prod machine using an SSH connection. Pull your changes locally and then run the `deploy.sh` script in the terminal by doing:
`$ ./deploy.sh`

1: First, `deploy.sh` will stop the running docker containers running the old NGINX and Django code.
2: This script will run the command `$ ng build` which compiles the frontend Angular code.
3: It will then run the docker-compose.yaml file which will rebuild the NGINX container with the new frontend compiled code and then another container with the Django backend.
4: It runs the two containers in 'detached mode' which essentially runs them in the background of the computer.
