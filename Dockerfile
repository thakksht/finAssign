FROM node:18

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install
COPY . .

RUN npx prisma generate
RUN npx prisma db push
RUN npx prisma migrate deploy

EXPOSE 3000

CMD ["npm", "run", "dev"]
