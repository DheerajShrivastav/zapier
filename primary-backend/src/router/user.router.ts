import { Router } from 'express'
import { authMiddleware } from '../middleware'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { SigninSchema, SignupSchema } from '../types'
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../config'
import { Request } from 'express'


const router = Router()
const client = new PrismaClient()

async function isUserExist(email: string) {
  const user = await client.user.findFirst({
    where: {
      email,
    },
  })
  if (!user) {
    return false
  }
  return true
}
router.post('/signup', async (req, res) => {
  const body = req.body
  const parsedData = SignupSchema.safeParse(body)
  if (!parsedData.success) {
    return res.status(400).send('Input is invalid')
  }

  if (await isUserExist(parsedData.data.email)) {
    return res.status(400).send('User already exist')
  } else
    await client.user.create({
      data: {
        name: parsedData.data.name,
        email: parsedData.data.email,
        password: parsedData.data.password,
      },
    })
  res.send('User created successfully')
})
router.post('/signin', async (req, res) => {
  const body = req.body
  const parsedData = SigninSchema.safeParse(body)
  if (!parsedData.success) {
    return res.status(400).send('Input is invalid')
  }

  const user = await client.user.findFirst({
    where: {
      email: parsedData.data.email,
      password: parsedData.data.password,
    },
  })

  if (!user) return res.status(400).send('User does not exits')

  if (user) {
    const token =  jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      JWT_SECRET_KEY,
      { expiresIn: '2 days' }
    )
    // return { user: { id: user.id, name: user.name }, token: token }

    return res
      .status(300)
      .json({
        token: token,
        message : 'User logged in successfully'
      })
      
  }
})

router.get(
  '/:id',
  authMiddleware,
  async (req, res) => {
    // @ts-ignore
    const id = parseInt(req.params.id, 10)
    console.log(id)
    if (!id){
      return res.status(400).send('User does not exits')
    }
    const user = await client.user.findFirst({
      where: {
        id: id,
      },
      select: {
        name: true,
        email: true,
      },
    })
    if (!user) {
      return res.status(404).send('User does not exist in the database')
    }
    return res.status(200).json({ user })
  }
)

export const userRouter = router
