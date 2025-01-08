# tasks

Self-hosted Open-Source Task Manager

## Installation

> [!WARNING]
> The project is under heavy development and is not ready yet for deployment.

## Development

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