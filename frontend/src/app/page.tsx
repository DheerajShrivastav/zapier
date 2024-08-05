'use client'
import Image from 'next/image'
import Hero from '../components/Hero'
import HeroVideo from '../components/HeroVideo'
import Navbar from '@/components/Navbar'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <Navbar />
      <Hero />
      <HeroVideo />
    </main>
  )
}
