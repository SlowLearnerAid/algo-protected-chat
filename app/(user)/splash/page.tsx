'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { images } from './images'
import { useState } from 'react'
import LinkButton from './linkButton'

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }
  },
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: (direction: number) => {
    return {
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  }
}

const wrap = (min_val: number, max_val: number, value: number) => {
  const range_size = max_val - min_val
  return (((value - min_val) % range_size) + min_val) % range_size
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

const SplashPage = () => {
  const [[page, direction], setPage] = useState([0, 0])

  const imageIndex = wrap(0, images.length, page)

  const paginate = (newDirection: number) => {
    if (newDirection === -1 && page === 0) {
      return 0
    }
    setPage([page + newDirection, newDirection])
  }
  const handleClick = (e: any, n: number) => {
    e.preventDefault()
    if (page > n) {
      setPage([n, -1])
    } else {
      setPage([n, 1])
    }
  }

  return (
    <>
      <div className="flex flex-row items-center justify-center">
        <svg
          width="18"
          height="80"
          onClick={(e: any) => {
            handleClick(e, 0)
          }}
        >
          <circle
            cx="5"
            cy="40"
            r="5"
            className={`${wrap(0, images.length, page) === 0 ? 'fill-red-500' : 'fill-black'}`}
          ></circle>
        </svg>
        <svg
          width="18"
          height="80"
          onClick={(e: any) => {
            handleClick(e, 1)
          }}
        >
          <circle
            cx="5"
            cy="40"
            r="5"
            className={`${wrap(0, images.length, page) === 1 ? 'fill-red-500' : 'fill-black'}`}
          ></circle>
        </svg>
        <svg
          width="18"
          height="80"
          onClick={(e: any) => {
            handleClick(e, 2)
          }}
        >
          <circle
            cx="5"
            cy="40"
            r="5"
            className={`${wrap(0, images.length, page) === 2 ? 'fill-red-500' : 'fill-black'}`}
          ></circle>
        </svg>
      </div>
      <div className="flex flex-col not-italic font-normal text-2xl leading-8 ml-40">
        {`${images[imageIndex].f_description}`}
        <br></br>
        <b>{`${images[imageIndex].s_description}`}</b>
      </div>
      <div className="overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode={'wait'}>
          <motion.img
            width="384"
            height="616"
            key={page}
            src={images[imageIndex].src}
            custom={direction}
            variants={variants}
            className="w-96 ml-16 rounded-md"
            initial="entry"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 200, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              e.preventDefault()
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
          />
        </AnimatePresence>
        <div className="ml-16 z-10 fixed">
          <LinkButton></LinkButton>
        </div>
      </div>
    </>
  )
}

export default SplashPage
