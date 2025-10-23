/*
 * adonisjs-pg-boss
 *
 * (c) AKAGO SAS <po@akago.fr>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import PgBoss from 'pg-boss'

export type PgBossConfig = PgBoss.ConstructorOptions & {
  healthCheck?: {
    /**
     * If the number of pending jobs is above this threshold, the health check will return a warning
     */
    pendingCountWarningThreshold?: number
  }
}

export function defineConfig<T extends PgBossConfig>(config: T): T {
  return config
}
