FROM node:16.13 as build-deps
WORKDIR /usr/src/app
COPY . ./
RUN yarn
RUN yarn build

FROM node:16.13
WORKDIR /usr/src/app
COPY --from=build-deps /usr/src/app/build /usr/src/app/build
EXPOSE 3000
RUN npm install -g serve
CMD ["serve", "-l", "3000", "-s", "build"]