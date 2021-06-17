FROM nikolaik/python-nodejs:latest

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ENV PORT=80 DATABASE_URL=mongodb://localhost/BSUMagicPlan MAGIC_URL=https://cloud.magic-plan.com/api/v2=

EXPOSE 80

CMD [ "npm","start" ]