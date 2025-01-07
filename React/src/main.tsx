import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Tailwind styles

console.log('React app initializing...')

// Inject React into the root div provided by WordPress
const rootElementId = (window as any).myReactPluginData?.rootElementId || 'react-root'
console.log('Looking for root element with ID:', rootElementId)

// Try to find existing root element
let rootElement = document.getElementById(rootElementId)

// If no root element exists (e.g., in development), create one
if (!rootElement) {
  console.log('Creating root element for development environment...')
  rootElement = document.createElement('div')
  rootElement.id = rootElementId
  document.body.appendChild(rootElement)
}

console.log('Found/created root element:', rootElement)
console.log('Creating React root...')
const root = ReactDOM.createRoot(rootElement)
console.log('Rendering app...')
root.render(<App />)
