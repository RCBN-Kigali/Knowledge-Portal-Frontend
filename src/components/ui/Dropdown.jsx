import { useState, useRef, useEffect, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

const Ctx = createContext(null)

function Dropdown({ children, className }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) }
    if (isOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])
  return <Ctx.Provider value={{ isOpen, setIsOpen }}><div ref={ref} className={clsx('relative inline-block', className)}>{children}</div></Ctx.Provider>
}
Dropdown.propTypes = { children: PropTypes.node.isRequired, className: PropTypes.string }

Dropdown.Trigger = function Trigger({ children, className }) {
  const { isOpen, setIsOpen } = useContext(Ctx)
  return (
    <button type="button" onClick={() => setIsOpen(!isOpen)} className={clsx('inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 min-h-[44px]', className)}>
      {children}<ChevronDown className={clsx('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
    </button>
  )
}
Dropdown.Trigger.propTypes = { children: PropTypes.node.isRequired, className: PropTypes.string }

Dropdown.Menu = function Menu({ children, align = 'left', className }) {
  const { isOpen } = useContext(Ctx)
  if (!isOpen) return null
  const aligns = { left: 'left-0', right: 'right-0' }
  return <div className={clsx('absolute z-50 mt-2 py-1 min-w-[160px] bg-white rounded-lg border border-gray-200 shadow-lg', aligns[align], className)}>{children}</div>
}
Dropdown.Menu.propTypes = { children: PropTypes.node.isRequired, align: PropTypes.oneOf(['left', 'right']), className: PropTypes.string }

Dropdown.Item = function Item({ children, onClick, disabled, className }) {
  const { setIsOpen } = useContext(Ctx)
  return <button type="button" onClick={() => { onClick?.(); setIsOpen(false) }} disabled={disabled} className={clsx('w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:text-gray-400', className)}>{children}</button>
}
Dropdown.Item.propTypes = { children: PropTypes.node.isRequired, onClick: PropTypes.func, disabled: PropTypes.bool, className: PropTypes.string }

Dropdown.Divider = () => <div className="my-1 border-t border-gray-200" />
export default Dropdown
