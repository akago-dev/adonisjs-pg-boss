/*
 * adonisjs-pg-boss
 *
 * (c) AKAGO SAS <po@akago.fr>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import PgBoss from 'pg-boss'

export type PgBossConfig = PgBoss.ConstructorOptions & {}

export function defineConfig<T extends PgBossConfig>(config: T): T {
  return config
}
