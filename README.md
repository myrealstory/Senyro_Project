## Known Bugs

1. Debugger bug
   Can't use "NODE_OPTIONS=--inspect" to debug server side since v13.4.x

- https://github.com/vercel/next.js/issues/48767

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

## Docker

### Commands

Build docker image using Dockerfile

```
Basic
docker build {Dockerfile-path}

With args / options
docker build [-t {image-name}] {Dockerfile-path} . [--build-arg BUILD_ENV={env file extension}] [--build-arg NODE_ENV={node-env}]

Example (for this project)
docker build -t senryo-dev . --build-arg BUILD_ENV=dev --build-arg NODE_ENV=production
```

Run docker image

```
Basic
docker run {image-name}

With options
docker run [--name {container-name}] [-p {local-port}:{container-port}] {image-name}

Example (for this project)
docker run --name senryo-container -p 3000:3000 senryo-dev
```

Remove docker container

```
Basic
docker rm {container-name}

With options
docker rm [-fv] {container-name}

Example (for this project)
docker rm -fv senryo-container
```

Remove docker image

```
Basic
docker rmi {image-name}

Example (for this project)
docker rmi senryo-dev
```

Remove all unused container and image

```
Basic
docker system prune --all --force --volumes
```

Options explaination

```
docker build
-t: image name
--build-arg: the arg that needs to pass to the Dockerfile

docker run
--name: container name
-p: expose the container port to host by mapping the host port to container port

docker rm
-f: force
-v: volumn (image)

docker system prune
--all:  all unused images and volumes, including those that are not dangling (not associated with any container or tag)
--force:
--volumns: (images; any volumes not used by at least one container)
```

---

## Docker compose

```
for local development only
```

```
To start the docker-compose
docker-compose up

With specify env
docker-compose --env-file {env file path} up

**The env file would overrided the value of ${ENV_NAME} defined in the docker-compose.yml**
```

Options explaination

```
docker-compose
-p: service name
-f: target docker compose yml file
--build: build the image again before turn the docker service up
--env-file: target env file used to override the default env value
```

---

## npm script

```
Pass vars to npm script

"docker-compose-down": "docker-compose --env-file .env.${npm_config_build_env} down"
npm run docker-compose-down --build_env=production

```
