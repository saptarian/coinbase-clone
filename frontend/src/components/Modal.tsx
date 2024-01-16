import { useState, useEffect } from 'react'


type ModalNode = React.ReactNode | (
  (obj: {
    open: boolean
    setOpen: (value: React.SetStateAction<boolean>) => void
  }) => React.ReactNode
)

type ModalProps = {
  trigger: ModalNode
  toggle: boolean
  onOpen: () => void
  onClose: () => void
  hideClose: boolean
  isCenterScreen: boolean
  children: ModalNode
  className: string
}

const Modal: React.FC<Partial<ModalProps>> = ({
  toggle,
  onOpen, 
  onClose,
  trigger, 
  children, 
  className,
  hideClose, 
  isCenterScreen,
}) =>
{
	const [open, setOpen] = useState<boolean>(false)

  const handleClose = () => {
    onClose?.()
    setOpen(false)
  }

  const handleOpen = () => {
    onOpen?.()
    setOpen(true)
  }


  useEffect(() => {
    if (toggle === true)
      handleOpen()

    else if (toggle === false)
      handleClose()

  }, [toggle])


	return (
		<>
			{trigger ? typeof trigger === 'function' ? 
        trigger({open, setOpen}) : (
          <span onClick={handleOpen} className="cursor-pointer">
            {trigger}
          </span>
        ) : ''}
      {open ? (
        <div 
          onClick={handleClose} 
          className={`fixed z-40 inset-0 bg-black/20 max-h-full ${
            isCenterScreen ? "flex items-center justify-center" : ""
          } overflow-x-hidden overflow-y-auto w-full h-[calc(100%-0rem)]`}>
          <div className={
            `overflow-auto shadow relative max-h-full ${
              isCenterScreen ? "sm:mx-auto" : ""
            } ${className ?? "sm:w-fit sm:h-fit"
            } max-sm:w-full max-sm:m-0 max-sm:h-screen`}
            onClick={(e) => e.stopPropagation()}>
            {!hideClose ? (
              <div className="sm:hidden w-full bg-white p-2 
                text-right pt-14 border-b">
                <button 
                  onClick={handleClose}
                  className="px-2 py-4"
                ><div className="bg-stone-500 w-6 h-[3px] 
                  rounded-md rotate-45 translate-y-[3px]"></div>
                  <div className="bg-stone-500 w-6 h-[3px] 
                  rounded-md -rotate-45"></div>
                </button>
              </div>
            ) : ''}
            {children 
              ? typeof children === 'function' 
                ? children({open, setOpen})
                : children 
            : ''}
          </div>
        </div>
      ) : ''}
    </>
	)
}


export default Modal
