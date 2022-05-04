# pull official base image
FROM node:14-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
RUN yarn install 
RUN yarn global add react-scripts@4.0.0

# add app
COPY . ./

# Expose port
EXPOSE 3000

# start app
CMD ["yarn", "start"]
