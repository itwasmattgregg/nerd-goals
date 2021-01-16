# Nerd Goals

This is a most amazing app for keeping track of your personal goals and
discovering the goals and skills of others.

## Setup

To set this project up locally you'll need .env variables from Google for auth
and the uri of the database.

Run `yarn` to install packages.

Run `yarn dev` to start the local server

If any database schema changes are made migrations can be run with
`npx prisma db push --preview-feature`.

The Prisma studio can be viewed with the command `npx prisma studio`
