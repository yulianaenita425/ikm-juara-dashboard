import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function ScreenshotGallery() {
  const [currentImage, setCurrentImage] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const screenshots = [
    {
      title: 'Dashboard Real-time',
      description: 'Monitoring statistik IKM JUARA dengan update real-time',
      image: '/api/placeholder/800/600?text=Dashboard+Real-time',
      alt: 'Dashboard IKM JUARA dengan statistik real-time'
    },
    {
      title: 'Manajemen IKM Binaan',
      description: 'Interface CRUD untuk data IKM Binaan',
      image: '/api/placeholder/800/600?text=IKM+Binaan+Management',
      alt: 'Halaman manajemen IKM Binaan'
    },
    {
      title: 'HKI Merek',
      description: 'Pengelolaan pendaftaran HKI Merek',
      image: '/api/placeholder/800/600?text=HKI+Merek+Management',
      alt: 'Halaman HKI Merek'
    },
    {
      title: 'Sertifikat Halal',
      description: 'Manajemen sertifikat halal',
      image: '/api/placeholder/800/600?text=Sertifikat+Halal',
      alt: 'Halaman Sertifikat Halal'
    },
    {
      title: 'Laporan & Analytics',
      description: 'Laporan komprehensif dan analytics',
      image: '/api/placeholder/800/600?text=Reports+Analytics',
      alt: 'Halaman laporan dan analytics'
    }
  ]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % screenshots.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  const openModal = (index) => {
    setCurrentImage(index)
    setShowModal(true)
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Screenshot Aplikasi
      </h2>
      
      {/* Main Screenshot Display */}
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <img
            src={screenshots[currentImage].image}
            alt={screenshots[currentImage].alt}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openModal(currentImage)}
          />
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
        
        {/* Image Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <h3 className="text-white text-xl font-semibold mb-2">
            {screenshots[currentImage].title}
          </h3>
          <p className="text-gray-200 text-sm">
            {screenshots[currentImage].description}
          </p>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center space-x-4 overflow-x-auto pb-4">
        {screenshots.map((screenshot, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              currentImage === index 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={screenshot.image}
              alt={screenshot.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentImage === index ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Modal for Full Size View */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            
            <img
              src={screenshots[currentImage].image}
              alt={screenshots[currentImage].alt}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <h3 className="text-white text-2xl font-semibold mb-2">
                {screenshots[currentImage].title}
              </h3>
              <p className="text-gray-200">
                {screenshots[currentImage].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}