# tasks

Self-hosted Open-Source Task Manager

## Installation

> [!WARNING]
> The project is under heavy development and is not ready yet for deployment.

### Docker

> [!WARNING]
> Using `latest` as the tag for the image is highly discouraged as it may download a different version on different platforms if left as in the example below, leading to unexpected behaviors. Always use a fixed version and check often for updates when you can.

```bash
docker run -d \
  --name tasks \
  --restart unless-stopped \
  -p 8000:8000 \
  -v /var/lib/tasks:/app/data \
  -e ADMINISTRATOR_USERNAME=administrator \
  -e ADMINISTRATOR_PASSWORD=ChangeMeNowOrIllHauntYouInYourDarkestDreamYoullNeverWantToSleepAgainBeware \
  --health-cmd="curl -f http://localhost:8000 || exit 1" \
  --health-interval=1m \
  --health-timeout=10s \
  --health-retries=3 \
  --health-start-period=30s \
  aminnairi/tasks:latest
```

### Docker Compose

> [!WARNING]
> Using `latest` as the tag for the image is highly discouraged as it may download a different version on different platforms if left as in the example below, leading to unexpected behaviors. Always use a fixed version and check often for updates when you can.

```yaml
services:
  tasks:
    container_name: tasks
    image: aminnairi/tasks:latest
    restart: unless-stopped
    ports:
      - 8000:8000
    volumes:
      - /var/lib/tasks:/app/data
    environment:
      ADMINISTRATOR_USERNAME: administrator
      ADMINISTRATOR_PASSWORD: ChangeMeNowOrIllHauntYouInYourDarkestDreamYoullNeverWantToSleepAgainBeware
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000"]
      interval: 1m
      timeout: 10s
      retries: 3
      start_period: 30s
      start_interval: 5s
```

## Development

### Technologies used

#### TypeScript

TypeScript is used as the programming language choosen for writing both the client & server source-code.

#### React.js

React.js is a library that helps writing Web application faster than using directly the Web APIs such as the DOM Web API. This is the library that has been choosen for the client Web application. The client has been generated using Vite.js as the bundler of choice.

It uses React Router for the routing library, and Material UI for the application visual theme.

#### Renkei

Renkei is a library that aims at reducing the friction between the client and the server by sharing common types. It also helps when refactoring code and changing the specification for the shape of a request or response, aiming at creating a HTTP server that is safe to use on the client.

#### Clean Architecture

This project has been architectured using the Clean Architecture principles, aiming at creating a safe environment by separating the business logic from the technical implementation details, helping migrate from one framework or library to another without friction.

#### Event Sourcing

The storage of data has been architectured around the idea of Event Sourcing, providing a safe data storage strategy and some other goodies such as auditability and data security.

### Requirements

- [Node](https://nodejs.org)
- [NPM](https://npmjs.com)
- [Git](https://git-scm.com/)

### Clone

```bash
git clone https://github.com/aminnairi/tasks
cd tasks
```

### Installation

Install all workspaces dependencies.

```bash
npm i
```

### Server Startup

Start the server at [`localhost:8000`](http://localhost:8000).

```bash
npm -w @todo/server run dev
```

### Client Startup

Start the client at [`localhost:5173`](http://localhost:5173).

```bash
npm -w @todo/client run dev
```