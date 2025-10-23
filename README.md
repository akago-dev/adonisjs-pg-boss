[Pg-boss](https://timgit.github.io/pg-boss/#/) for [AdonisJS](https://adonisjs.com/)

> [!WARNING]
> This package takes a somehow unconventional approach. Pgboss will run besides the AdonisJS http server, in the same process. You don't have to run it besides your main app.
> In a nodejs clustered environement, only one pgboss instance will consume jobs, others will have `schedule`, `supervise`, `migrate` set to `false`.


> [!NOTE]
> At the moment, this package depends on "github:akago-dev/pg-boss#akago" (not the main repository) as we need [a feature that is not merged yet](https://github.com/timgit/pg-boss/pull/617).

## Installation

```sh
node ace add @akago/adonis-pb-boss
```


## Configuration

Edit `config/pgboss.ts` to fit your needs.
