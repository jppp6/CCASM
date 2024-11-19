FROM nginx:latest

WORKDIR .

RUN rm /etc/nginx/conf.d/default.conf
COPY conf.d/ /etc/nginx/conf.d/

RUN mkdir -p /home/nginxuser/staticfiles

COPY ./dist/frontend /home/nginxuser/staticfiles


