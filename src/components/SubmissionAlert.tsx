'use client'

import { Terminal } from "lucide-react";
import { RefObject, Dispatch, SetStateAction, useEffect, useState } from "react"
import { Alert, AlertTitle } from "./ui/alert";


interface SubmissionAlertProps {
  formRef: RefObject<HTMLFormElement>;
  formState: any
}

export default function SubmissionAlert({ formRef, formState }: SubmissionAlertProps) {

  const [alertVisible, setAlertVisible] = useState(false)

  const resetForm = () => {
    formRef?.current?.reset()
  }
  
  // show alert for 5 seconds
  const showNotifcation = () => {
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  }

  useEffect(() => {
    if(formState?.status == 'success') {
      showNotifcation()
      resetForm()
    }
  }, [formState])

  return (
    <>
      {
        alertVisible && (
          <div className="fixed bottom-4 left-4 z-50 max-w-sm transition-all duration-300 ease-in-out">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Submission Success!</AlertTitle>
            </Alert>
          </div>
        )
      }
    </>
  )
}