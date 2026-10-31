import { useSmoothScroll } from './hooks/useSmoothScroll'
import Cursor from './components/Cursor'
import Hud from './components/Hud'
import Hero from './components/Hero'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Cursor />
      <Hud />
      <main>
        <Hero />
      </main>
    </>
  )
}
