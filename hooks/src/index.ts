import express from 'express'
import { PrismaClient } from '@prisma/client'
const client = new PrismaClient()
const app = express()
app.use(express.json())
app.post('/hooks/catch/:userId/:zapId', async (req, res) => {
  const { userId, zapId } = req.params
  const body = req.body
  console.log('userId', userId)
  await client.$transaction(async (tx) => {
    const run = await tx.zapRun.create({
      data: {
        zapId: zapId,
        metadata: body,
      },
    })
    console.log('here')
    await tx.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    })
    console.log(`User ${userId} caught a Zap ${zapId}`)
    res.send(`User ${userId} caught a Zap ${zapId}`)
  })
})
app.listen(3000)
console.log('app is running on port 3000')
