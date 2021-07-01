FROM nikolaik/python-nodejs:latest

WORKDIR /app

COPY package.json ./

RUN npm install

RUN pip install numpy

COPY . .

ENV PORT=8080 DATABASE_URL=mongodb://mongo:27017/BSUMagicPlan MAGIC_URL=https://cloud.magic-plan.com/api/v2

EXPOSE 8080

CMD [ "npm","start" ]