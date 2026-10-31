import { useSmoothScroll } from './hooks/useSmoothScroll'
import Cursor from './components/Cursor'
import Hud from './components/Hud'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Journey from './components/Journey'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Cursor />
      <Hud />
      <main>
        <Hero />
        <Projects />
        <Journey />
      </main>
    </>
  )
}
