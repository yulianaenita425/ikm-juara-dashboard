// API endpoint untuk generate placeholder images
export default function handler(req, res) {
  const { params } = req.query
  const [dimensions, query] = params || []
  
  // Parse dimensions (e.g., "800x600")
  const [width = 800, height = 600] = dimensions?.split('x').map(Number) || [800, 600]
  
  // Parse query parameters
  const urlParams = new URLSearchParams(query || '')
  const text = urlParams.get('text') || 'Preview Image'
  const bgColor = urlParams.get('bg') || '4F46E5' // Default blue
  const textColor = urlParams.get('color') || 'FFFFFF' // Default white
  
  // Generate SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${bgColor}88;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 20}" 
            fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">
        ${decodeURIComponent(text)}
      </text>
      <text x="50%" y="${height - 30}" font-family="Arial, sans-serif" font-size="14" 
            fill="#${textColor}88" text-anchor="middle" dominant-baseline="middle">
        ${width} × ${height}
      </text>
    </svg>
  `
  
  res.setHeader('Content-Type', 'image/svg+xml')
  res.setHeader('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
  res.status(200).send(svg)
}