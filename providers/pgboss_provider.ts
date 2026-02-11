/*
 * adonisjs-pg-boss
 *
 * (c) AKAGO SAS <po@akago.fr>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationService } from '@adonisjs/core/types'
import cluster from 'node:cluster'
import { PgBoss } from 'pg-boss'
import { PgBossConfig } from '../src/define_config.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    pgBoss: any
  }
}

export default class PgBossProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    const config = this.app.config.get<PgBossConfig>('pgboss', {})

    const isFirstWorker = cluster.isPrimary || cluster.worker?.id === 1

    const boss = new PgBoss({
      ...config,
      schedule: isFirstWorker,
      supervise: isFirstWorker,
      migrate: isFirstWorker,
    })

    this.app.container.singleton(PgBoss, async () => boss)
  }

  async shutdown() {
    const boss = await this.app.container.make(PgBoss)
    await boss.stop()
  }
}
