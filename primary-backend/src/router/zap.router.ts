import { Router, text } from 'express'
import { authMiddleware } from '../middleware'
import { any } from 'zod'
import { ZapCreateSchema } from '../types'
import { PrismaClient } from '@prisma/client'
const router = Router()
const client = new PrismaClient()


router.post('/', authMiddleware, async (req, res) => {
  // @ts-ignore
  const id: string = req.id
  const body = req.body
  const parseData = ZapCreateSchema.safeParse(body)
  if (!parseData.success) {
    return res.status(400).send('Invalid data')
  }
  await client.$transaction(async (tx) => {
    const zap = await client.zap.create({
      data: {
        userId: parseInt(id),
        triggerId: '',
        actions: {
          create: parseData.data.actions.map((x, index) => ({
            actionId: x.availableActionId,
            sortingOrder: index,
          })),
        },
      },
    })
    const trigger = await client.trigger.create({
      data: {
        triggerId: parseData.data.availableTriggerId,
        zapId: zap.id,
      },
    })  
    await tx.zap.update({
      where: {
        id: zap.id,
      },
      data: {
        triggerId: trigger.id,
      },
    })
  
    
  })
  return res.send('Zap created successfully')
})

router.get('/', authMiddleware, async(req, res) => {
  //@ts-ignore
  const id = req.user?.id
  const zaps = await client.zap.findMany({
    where: {
      userId: id,
    },
    include:{
      actions:{
        include:{
          type:true
        }
      },
      trigger: {
        include: {
          type: true,
        },
      },
      
    }
  })
  return res.json({
    zaps
  })
})



router.get('/:zapId', authMiddleware,async (req, res) => {
  // @ts-ignore
  const id = req.user?.id
  const zapId = req.params.zapId

  const zap = await client.zap.findFirst({
    where: {
      id: zapId,
      userId: id,
    },
    include: {
      actions: {
        include: {
          type: true,
        },
      },
      trigger: {
        include: {
          type: true,
        },
      },
    },
  })
  if (!zap) {
    return res.status(404).send('Zap not found')
  }
  return res.json({
    zap,
  })
})

export const zapRouter = router
