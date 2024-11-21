import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Tailwind styles

// Inject React into the root div provided by WordPress
const rootElementId =
  (window as any).myReactPluginData?.rootElementId || 'react-root'
const rootElement = document.getElementById(rootElementId)

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}
