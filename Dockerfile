######################
#Build for local development
######################

#base image
FROM node:20-alpine AS development

#Create App Directory
WORKDIR /usr/src/App

#Copy package.json and package-lock.json
COPY package*.json ./

#install app dependencies
RUN npm ci

#Bundle app source
COPY . .

######################
#Build for production
######################

FROM node:20-alpine As build

WORKDIR /usr/src/app

COPY package*.json ./

# In order to run `npm run build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN npm ci --only=production && npm cache clean --force

######################
#Production
######################

FROM node:20-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

