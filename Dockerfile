# base image
FROM node:12.4.0

# Move code to work dir
RUN mkdir /code
ADD . /code/
WORKDIR /code

# install and cache app dependencies
RUN npm install
RUN npm install -g @angular/cli@7.3.9
