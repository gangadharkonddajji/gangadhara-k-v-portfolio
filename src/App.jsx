import { useSmoothScroll } from './hooks/useSmoothScroll'
import Cursor from './components/Cursor'
import Hud from './components/Hud'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Cursor />
      <Hud />
    </>
  )
}
