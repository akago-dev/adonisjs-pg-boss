import app from '@adonisjs/core/services/app'
import { Assert } from '@japa/assert'
import { PgBoss } from 'pg-boss'

declare module '@japa/assert' {
  interface Assert {
    /** Waits for all jobs of queue to complete.
     * Will throw an assertion error if jobs are not completed within the timeout period.
     * @param queue The name of the queue to monitor.
     * @param timeout The maximum time to wait for jobs to complete, in milliseconds. (default: 10000)
     */
    jobsCompleted(queue: string, timeout?: number): Promise<void>
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const assertPgBoss = () =>
  function () {
    Assert.macro(
      'jobsCompleted',
      async function (this: Assert, queue: string, timeout: number = 10000): Promise<void> {
        const pgBoss = await app.container.make(PgBoss)
        const startTime = Date.now()
        let pending: number

        while (startTime + timeout > Date.now()) {
          let queueData = await pgBoss.getQueueStats(queue)
          if (!queueData) throw Error(`Queue "${queue}" does not exist.`)
          pending = queueData.queuedCount + queueData.activeCount
          if (pending === 0) break
          else await sleep(500)
        }

        // @ts-expect-error TS2454
        return this.equal(pending, 0, `Queue "${queue}" has pending jobs after ${timeout}ms`)
      }
    )
  }
