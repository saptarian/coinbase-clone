import React from 'react'
import { createPortal } from "react-dom"
import { useLocation } from "react-router-dom"
import { Close } from '@/components/Icons'


type PortalNode = React.ReactNode | (
  (kwargs: {
    open: boolean
    handleOpen: () => void
    handleClose: () => void
  }) => React.ReactNode
)

type PortalProps = Partial<{
  trigger: PortalNode
  toggle: boolean
  onOpen: () => void
  onClose: () => void
  showClose: boolean
  isCenterScreen: boolean
  children: PortalNode
  className: string
  isPortal: boolean
  ignoreDark: boolean
  ignoreFreeze: boolean
}>

const Portal: React.FC<PortalProps> = ({
  toggle,
  onOpen, 
  onClose,
  trigger, 
  isPortal,
  children, 
  className,
  showClose, 
  ignoreDark,
  ignoreFreeze,
  isCenterScreen,
}) =>
{
  const location = useLocation()
  const [open, setOpen] = React.useState(false)
  const handleClose = React.useCallback(() => {
    onClose?.()
    setOpen(false)
    document.removeEventListener("scroll", handleClose)
    document.body.style.overflow = 'unset'
    document.body.style.paddingRight = ''
  }, [])

  const handleOpen = React.useCallback(() => {
    onOpen?.()
    setOpen(true)
    if (window?.document) {
      document.addEventListener("scroll", handleClose)
      if (!ignoreFreeze) {
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = '17px'
      }
    }
  }, [])

  React.useEffect(() => {handleClose()}, [location])
  React.useEffect(() => {
    toggle ? handleOpen() : handleClose()
  }, [toggle])

  const props = { open, handleOpen, handleClose,
    isCenterScreen, className, showClose, ignoreDark }
  const ele = document?.getElementById("modal")

  return (
    <>
      {trigger ? typeof trigger === 'function' ? 
        trigger({open, handleOpen, handleClose}) : (
          <span onClick={handleOpen} className="cursor-pointer">
            {trigger}
          </span>
        ) : ''}
      {isPortal && ele
        ? createPortal(
            <Container {...props}>{children}</Container>
            , ele
          ) : 
        <Container {...props}>{children}</Container> 
      }
    </>
  )
}


const Container = (props: PortalProps & {
  open: boolean
  handleOpen: () => void
  handleClose: () => void
}) => 
{
  return (
    <div onClick={props.handleClose}
      className={`${props.ignoreDark ? '' : 'bg-black/20'
      } fixed z-40 inset-0 max-h-full ${
        props.isCenterScreen ? "flex items-center justify-center" : ""
      } overflow-x-hidden overflow-y-auto w-full h-[calc(100%-0rem)] ${
          props.open ? 'opacity-100 visible' : 'invisible opacity-0'
        } transition-opacity duration-100 ease-in-out`}
    >
      <div onClick={(e) => e.stopPropagation()}
        className={`overflow-auto relative max-h-full bg-white ${
          props.className ?? ""
        } ${props.ignoreDark ? 'shadow-2xl' : 'shdow-lg'
        } ring-1 ring-gray-200 rounded-sm ${
          props.open ? '' : 'hidden'
        }`}
      >
        {props.showClose ? (
          <div className="w-full bg-white
            text-right border-b h-[50px] p-2">
            <button onClick={props.handleClose} 
              className="px-3 py-2 text-gray-500 
                hover:text-stone-400">
              <Close className="w-5"/>
            </button>
          </div>
        ) : ''}
          {props.children 
            ? typeof props.children === 'function' 
              ? props.children({
                  open: props.open, 
                  handleOpen: props.handleOpen,
                  handleClose: props.handleClose
                })
              : props.children 
          : ''}
      </div>
    </div>
  )
}


export default Portal
