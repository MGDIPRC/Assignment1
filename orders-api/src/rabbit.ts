import amqp from 'amqplib'

const QUEUE = 'orders'

export async function sendOrderMessage(order: any) {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost'
  )
  const channel = await connection.createChannel()

  await channel.assertQueue(QUEUE)

  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(order)))

  console.log('Sent order to queue:', order)

  await channel.close()
  await connection.close()
}