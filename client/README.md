# Image:zen

## Create a .env file

Please do not use NEXT\__PUBLIC_ to secure secrets.

## Run the project

You can use the docker-compose file to spin up a Postgres instance.

```bash
docker-compose up --build -d
```

Then run the development server:

```bash
yarn install
npx prisma migrate dev
yarn dev
```

Prisma studio:

```bash
npx prisma studio
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
