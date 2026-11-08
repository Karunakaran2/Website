import { Slide, ToastContainer } from 'react-toastify'
import { APP_TOAST_SUCCESS_DURATION_MS } from './toastDuration'

import 'react-toastify/dist/ReactToastify.css'

/** Bottom-center app toasts (success / info / warning / error) — appearance set per toast. */
export default function AppSuccessToastContainer() {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={APP_TOAST_SUCCESS_DURATION_MS}
      hideProgressBar={false}
      newestOnTop
      closeOnClick={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover
      theme="light"
      closeButton
      limit={5}
      icon={false}
      transition={Slide}
      containerStyle={{ zIndex: 2147483647 }}
      toastClassName="!overflow-hidden !mb-2"
    />
  )
}
