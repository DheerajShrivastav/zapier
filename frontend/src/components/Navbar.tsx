import React from 'react'
import LinkButton from './buttons/LinkButton'
import { useRouter } from 'next/navigation'
import PrimaryButton from './buttons/PrimaryButton'

function Navbar() {
  const router = useRouter()
  return (
    <div className="flex justify-between w-full border-b">
      <div className='flex flex-col justify-center'>zapier</div>
      <div className='flex flex-row'>
        <LinkButton onClick={() => {}}>Constact Sales</LinkButton>
        <LinkButton
          onClick={() => {
            router.push('/login')
          }}
        >
          Login
        </LinkButton>
        <PrimaryButton
          onClick={() => {
            router.push('/signup')
          }}
          size='small'
        >
          Signup
        </PrimaryButton>
      </div>
      
    </div>
  )
}

export default Navbar
