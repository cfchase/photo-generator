FROM registry.access.redhat.com/ubi8/nodejs-18:latest as build-step

WORKDIR WORKDIR /opt/app-root
ENV PATH /opt/app-root/node_modules/.bin:$PATH
COPY --chown=default:root ./frontend/*.js ./
COPY --chown=default:root ./frontend/*.json ./

COPY --chown=default:root ./frontend/src ./src
COPY --chown=default:root ./frontend/stories ./stories
COPY --chown=default:root ./frontend/.storybook ./.storybook
COPY --chown=default:root ./frontend/__mocks__ ./__mocks__

RUN npm install
RUN npm run build

FROM registry.access.redhat.com/ubi9/python-39:latest

# Set the working directory in the container
WORKDIR /opt/app-root/src

# Copy the content of the local src directory to the working directory
COPY . .
COPY --from=build-step /opt/app-root/build ./frontend/build

# Install any dependencies
RUN pip install -r requirements.txt

# By default, listen on port 8081
EXPOSE 8081/tcp
ENV FLASK_PORT=8081

# Specify the command to run on container start
CMD [ "python", "./app.py" ]
CMD ["gunicorn","--config", "python:gunicorn_config", "app:app"]
