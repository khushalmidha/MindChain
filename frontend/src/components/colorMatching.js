import React, { useState, useContext } from 'react'
import { WalletContext } from '../context/WalletContext'
import { toast } from 'react-toastify'

const CalmColorMatching = () => {
  const { earnTokens } = useContext(WalletContext)

  const generateRandomColor = () => {
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    }
  }

  const [targetColor, setTargetColor] = useState(generateRandomColor())
  const [currentColor, setCurrentColor] = useState({ r: 128, g: 128, b: 128 })
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [canRedeemTokens, setCanRedeemTokens] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)

  const handleSliderChange = (color, value) => {
    setCurrentColor((prev) => ({
      ...prev,
      [color]: parseInt(value, 10),
    }))
  }

  const calculateScore = () => {
    if (isRedeeming) return

    const difference =
      Math.abs(targetColor.r - currentColor.r) +
      Math.abs(targetColor.g - currentColor.g) +
      Math.abs(targetColor.b - currentColor.b)

    const newScore = Math.max(100 - Math.round((difference / 765) * 100), 0)
    setScore(newScore)
    setGameCompleted(true)

    setIsAnimating(true)
    if (newScore >= 95) {
      setFeedback('Perfect match! Amazing job! 🎉')
      setCanRedeemTokens(true)
    } else if (newScore >= 85) {
      setFeedback('Very close! Great eye for color! ✨')
    } else if (newScore >= 70) {
      setFeedback('Good try! Getting there! 👍')
    } else if (newScore >= 50) {
      setFeedback('Not bad, keep adjusting! 🔄')
    } else {
      setFeedback('Keep trying, you can do better! 💪')
    }

    setTimeout(() => setIsAnimating(false), 700)
  }

  const resetGame = () => {
    if (isRedeeming) return
    setTargetColor(generateRandomColor())
    setCurrentColor({ r: 128, g: 128, b: 128 })
    setScore(0)
    setFeedback('')
    setGameCompleted(false)
    setCanRedeemTokens(false)
  }

  const redeemTokenHandler = async () => {
    try {
      setIsRedeeming(true)
      await toast.promise(earnTokens(), {
        pending: 'Transaction in progress ⏳',
        success: 'Tokens Redeemed Successfully',
        error: {
          render({ data }) {
            if (data && data.code === 'WALLET_NOT_CONNECTED') {
              return 'Please connect your wallet.'
            }
            return 'Transaction Aborted. Try again.'
          },
        },
      })
      setCanRedeemTokens(false)
      setTimeout(() => {
        resetGame()
        setIsRedeeming(false)
      }, 1000)
    } catch (e) {
      setIsRedeeming(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pt-16 pb-8'>
      {/* Header at the top */}
      <div className='text-center mb-8'>
        <h1 className='text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500'>
          Calm Color Matching
        </h1>
        <p className='text-gray-600 dark:text-gray-300 text-base'>
          Match the target color by adjusting the RGB sliders
        </p>
      </div>

      {/* Main Game Container */}
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Left Column with stacked blocks */}
          <div className='flex flex-col gap-6'>
            {/* Top block - Color boxes side by side */}
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
              <div className='flex flex-row justify-between gap-4'>
                {/* Target Color */}
                <div className='flex-1'>
                  <h2 className='text-lg font-medium mb-3 text-gray-800 dark:text-gray-200 text-center'>
                    Target Color
                  </h2>
                  <div
                    className='w-full aspect-square rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-inner'
                    style={{
                      backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`,
                    }}></div>
                </div>

                {/* Your Color */}
                <div className='flex-1'>
                  <h2 className='text-lg font-medium mb-3 text-gray-800 dark:text-gray-200 text-center'>
                    Your Color
                  </h2>
                  <div
                    className={`w-full aspect-square rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-inner transition-transform ${
                      isAnimating ? 'scale-105' : ''
                    }`}
                    style={{
                      backgroundColor: `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`,
                    }}></div>
                </div>
              </div>
            </div>

            {/* Bottom block - Controls and Feedback */}
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
              <h2 className='text-lg font-medium mb-4 text-gray-800 dark:text-gray-200'>
                Controls & Feedback
              </h2>

              {/* Buttons */}
              <div className='flex flex-wrap gap-3 mb-5'>
                <button
                  onClick={calculateScore}
                  className='flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-lg shadow-sm hover:from-teal-600 hover:to-emerald-600'>
                  Check Match
                </button>
                <button
                  onClick={resetGame}
                  disabled={isRedeeming}
                  className={`flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg shadow-sm hover:from-blue-600 hover:to-indigo-600 ${
                    isRedeeming ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                  New Color
                </button>
              </div>

              {/* Feedback Area */}
              {gameCompleted && (
                <div className='mb-4'>
                  <div className='mb-2'>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8'>
                      <div
                        className='h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500'
                        style={{
                          width: `${score}%`,
                          backgroundColor:
                            score >= 90
                              ? '#10B981'
                              : score >= 70
                              ? '#F59E0B'
                              : '#EF4444',
                        }}>
                        <span className='font-bold text-white'>{score}%</span>
                      </div>
                    </div>
                  </div>
                  <p
                    className={`text-center font-medium text-gray-800 dark:text-gray-200 ${
                      isAnimating ? 'animate-bounce' : ''
                    }`}>
                    {feedback}
                  </p>
                </div>
              )}

              {/* Redeem Button - Only show when score is high enough */}
              {canRedeemTokens && score >= 95 && (
                <button
                  className='w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold rounded-lg shadow-md hover:from-yellow-600 hover:to-amber-700 animate-pulse'
                  onClick={redeemTokenHandler}
                  disabled={isRedeeming}>
                  {isRedeeming ? 'Processing...' : 'Redeem 10 SOL Tokens'}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Tall block with sliders */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full'>
            <h2 className='text-lg font-medium mb-6 text-gray-800 dark:text-gray-200'>
              Adjust Colors
            </h2>

            {/* RGB Sliders */}
            <div className='space-y-12'>
              <ColorSlider
                color='r'
                value={currentColor.r}
                disabled={isRedeeming}
                onChange={(e) => handleSliderChange('r', e.target.value)}
              />
              <ColorSlider
                color='g'
                value={currentColor.g}
                disabled={isRedeeming}
                onChange={(e) => handleSliderChange('g', e.target.value)}
              />
              <ColorSlider
                color='b'
                value={currentColor.b}
                disabled={isRedeeming}
                onChange={(e) => handleSliderChange('b', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simplified Color Slider Component
const ColorSlider = ({ color, value, onChange, disabled }) => {
  const colors = {
    r: 'Red',
    g: 'Green',
    b: 'Blue',
  }

  const getSliderStyle = (color) => {
    switch (color) {
      case 'r':
        return 'from-gray-200 to-red-600 dark:from-gray-700'
      case 'g':
        return 'from-gray-200 to-green-600 dark:from-gray-700'
      case 'b':
        return 'from-gray-200 to-blue-600 dark:from-gray-700'
      default:
        return ''
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-3'>
        <label className='text-xl font-medium text-gray-800 dark:text-gray-200'>
          {colors[color]}
        </label>
        <span className='px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-md font-mono'>
          {value}
        </span>
      </div>
      <div className='relative h-6'>
        <input
          type='range'
          min='0'
          max='255'
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full h-4 bg-gradient-to-r ${getSliderStyle(
            color
          )} rounded-full appearance-none cursor-pointer focus:outline-none`}
        />
      </div>
    </div>
  )
}

export default CalmColorMatching
