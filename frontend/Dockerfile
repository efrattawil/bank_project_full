FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build 

FROM node:20 

WORKDIR /usr/src/app

COPY --from=builder /app/dist /usr/src/app/dist
COPY --from=builder /app/package.json ./

RUN npm install --production 

EXPOSE 5173

CMD ["sh", "-c", "npm run start"]