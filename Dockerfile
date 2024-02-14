# README -> Docker section
ARG HOST_PORT=3000
ARG NODE_ENV=production
ARG BUILD_ENV=production
ARG DEBUGGER_PORT

# This is a multi-stage Dockerfile which starts with a deps stage.
# =================================================== Deps stage ===================================================
# To scan the docker image vulnerabilities: snyk container test <repository>:<tag> --file=Dockerfile
# Image ref: https://snyk.io/docker-images/
FROM node:19.8.1-bullseye-slim AS deps
ARG BUILD_ENV
ARG NODE_ENV

RUN if [ "$NODE_ENV" != "production" ]; \
  then \
    NODE_ENV=development; \
  fi
  
WORKDIR /app

COPY package.json package-lock.json ./

RUN if [ "$NODE_ENV" = "production" ]; \
    then \
      npm install husky -g ; \
      npm i --production --legacy-peer-deps  ; \
    else \
      npm install husky -g ; \
      npm i --legacy-peer-deps && npm cache clean --force ; \
    fi
# =================================================== End of Deps stage ===================================================

# =================================================== Builder stage ===================================================
FROM node:19.8.1-bullseye-slim AS builder
ARG BUILD_ENV
ARG NODE_ENV

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN if [ "$NODE_ENV" = "production" ]; \
    then \
      /app/node_modules/.bin/env-cmd -f .env.$BUILD_ENV npm run build ; \
    fi

# =================================================== End of Builder stage ===================================================

# =================================================== Runner stage ===================================================
FROM node:19.8.1-bullseye-slim AS runner
ARG HOST_PORT
ARG NODE_ENV
ARG BUILD_ENV
ARG DEBUGGER_PORT

WORKDIR /app

ENV NODE_ENV ${NODE_ENV}
ENV BUILD_ENV ${BUILD_ENV}

# for next.js
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT ${HOST_PORT}
ENV DEBUGGER_PORT ${DEBUGGER_PORT}


# copy all files from the "/app" directory generated by the stage "builder" to the workdir of the stage "runner"
COPY --from=builder /app ./

# non-root user to execute the next.js

RUN mkdir -p ./.next
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs ./.next
USER nextjs

# a non public port exposed
EXPOSE ${HOST_PORT}
EXPOSE ${DEBUGGER_PORT}

CMD ["sh", "-c", \
    "if [ \"$NODE_ENV\" = \"production\" ] ; \
    then \
      npm run start ; \
    else \
      /app/node_modules/.bin/env-cmd -f \".env.$BUILD_ENV\" npm run dev --debugger_port=\"${DEBUGGER_PORT}\" ; \
    fi"]
# =================================================== End of Runner stage ===================================================
