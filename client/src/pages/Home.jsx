import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import LatestPosts from '../components/LatestPosts'
import CTASection from '../components/CtaSection'
import Footer from '../components/Footer'

const Home = () => {

  return (
    <div className='bg-[#213448]'>
      <Hero />
      <LatestPosts />
      <CTASection />
      <Footer />
    </div>
  )
}

export default Home
