# ---- Build stage ----
FROM node:18-alpine AS build
WORKDIR /app

# git is needed for git-based dependencies (e.g. xlsx via react-export-excel);
# rewrite ssh:// github URLs to https:// since no SSH key is available in the container
RUN apk add --no-cache git && \
    git config --global url."https://github.com/".insteadOf "ssh://git@github.com/"

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---- Production stage ----
FROM nginx:1.27-alpine AS production

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
