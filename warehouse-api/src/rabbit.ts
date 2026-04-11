import amqp from 'amqplib'

const QUEUE = 'orders'

export async function startConsumer() {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost'
  )
  const channel = await connection.createChannel()

  await channel.assertQueue(QUEUE)

  console.log('Warehouse waiting for messages...')

  channel.consume(QUEUE, (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString())

      console.log('Warehouse received:', content)

      channel.ack(msg)
    }
  })
}
