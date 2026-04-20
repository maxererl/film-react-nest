FROM node:20-alpine AS builder
WORKDIR /var/www/app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build

FROM node:20-alpine AS production
WORKDIR /var/www/app
COPY --from=builder /var/www/app/package*.json ./
RUN yarn --prod
COPY --from=builder /var/www/app/dist ./dist/
COPY --from=builder /var/www/app/public ./public/

EXPOSE 3000
CMD ["node", "./dist/main.js"]