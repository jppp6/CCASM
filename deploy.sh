#! /usr/bin/bash


sudo docker compose down

cd frontend

ng build

cd ..

sudo docker compose up