# typegraphql-playground

This is a learning playground, messing around with `type-graphql`. I am mostly following [Ben Awad's tutorial](https://www.youtube.com/playlist?list=PLN3n1USn4xlma1bBu3Tloe4NyYn9Ko8Gs), but updating for Apollo Server 3.x and `type-graphql` 1.x as I go since his guide is 2+ years old.

For persistence, I am trying out the [new CockroachDB Serverless offering](https://www.cockroachlabs.com/blog/how-we-built-cockroachdb-serverless/), since the always-free tier is extremely generous.

I am also using CockroachDB for persisting user sessions (as opposed to Redis), which led to some ugliness. Specifically, I had to fork the [connect-pg-simple](https://github.com/voxpelli/node-connect-pg-simple) library because it used Postgres' `to_timestamp(..)` function which does not exist in CockroachDB. `@raymondflores` has a [Cockroach flavored fork](https://github.com/raymondflores/node-connect-cockroachdb-simple) of `connect-pg-simple`, but it was based on an old version of the upstream which seems to have pretty severe bugs that leave all requests dangling (response data is sent, but connection is never closed). I was able to port all of those code changes into my [own fork](https://github.com/robwil/node-connect-pg-simple), and it seems to work well now.

## Pre-requisites

For user session storage, we require a `sessions` table in the database. I created it manually using this:

```sql
CREATE TABLE typegraphql_example."session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
);
ALTER TABLE typegraphql_example."session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");
CREATE INDEX "IDX_session_expire" ON typegraphql_example."session" ("expire");
```

## Setup

```
cp .env.example .env
# edit database password
yarn install
yarn start
```

## Configuration notes

The real database password is stored in `.env`, which is not in version control.