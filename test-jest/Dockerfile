FROM node:8-alpine



ENV APP_HOME=/home/app

# Copy the main application.
WORKDIR $APP_HOME
COPY . $APP_HOME


# Install dependancies
RUN npm install


# The main command to run when the container starts. Also
# tell the Rails dev server to bind to all interfaces by
# default.
CMD ["npm", "run", "test"]
