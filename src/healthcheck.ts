import { BaseCheck, Result } from '@adonisjs/core/health'
import app from '@adonisjs/core/services/app'
import type { HealthCheckResult } from '@adonisjs/core/types/health'
import PgBoss from 'pg-boss'
import { PgBossConfig } from './define_config.js'

/** Health check for PgBoss
 * Warns if too many jobs are pending (more than 100)
 */
export class PgBossCheck extends BaseCheck {
  name: string
  pendingStates = [PgBoss.states.created, PgBoss.states.retry, PgBoss.states.active]
  pendingCountWarningThreshold = 100

  constructor(name: string) {
    super()
    this.name = name

    const config = app.config.get<PgBossConfig>('pgboss', {})
    if (config.healthCheck?.pendingCountWarningThreshold !== undefined)
      this.pendingCountWarningThreshold = config.healthCheck.pendingCountWarningThreshold
  }

  async run(): Promise<HealthCheckResult> {
    const checkName = this.name + ' pgboss health check'

    const boss = await app.container.make(PgBoss)

    if (await boss.isInstalled()) {
      const queues = await boss.getQueues()
      const queuedCount = queues.reduce((sum, queue) => sum + (queue.queuedCount || 0), 0)
      const meta = { queuedCount, queues }
      if (queuedCount > this.pendingCountWarningThreshold) {
        return Result.warning(
          checkName + ' - too many queued jobs (' + queuedCount + ')'
        ).mergeMetaData(meta)
      } else {
        return Result.ok(checkName).mergeMetaData(meta)
      }
    } else {
      return Result.failed(checkName, new Error('pg-boss is not installed in database'))
    }
  }
}
