FROM node:16.13 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM node:16.13
WORKDIR /usr/src/app
COPY . ./
EXPOSE 3000
RUN npm i
CMD ["npm", "run", "start"]