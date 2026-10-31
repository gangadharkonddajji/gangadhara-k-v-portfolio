import { useSmoothScroll } from './hooks/useSmoothScroll'
import Cursor from './components/Cursor'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Cursor />
    </>
  )
}
