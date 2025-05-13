import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState<boolean>(false)
  console.log(showButton)
  const { pathname } = useLocation()
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }
  useEffect(() => {
    window.scrollTo({
      top: 0
    })
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  return (
    <>
      {showButton && (
        <button onClick={scrollToTop} className='bg-red-400 fixed bottom-10 right-10'>
          Top
        </button>
      )}
    </>
  )
}

export default ScrollToTop
