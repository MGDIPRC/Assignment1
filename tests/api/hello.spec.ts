import { test, expect } from 'vitest'
import setup, { type ServerTestContext } from './run_server'
import { Configuration, DefaultApi } from '../../client'

setup()

test<ServerTestContext>('hello says hello', async ({ address }) => {
  const client = new DefaultApi(new Configuration({ basePath: address }))
  const result = await client.sayHello({ name: 'Megan' })
  expect(result).toBe('Hello Megan')
})