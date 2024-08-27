'use client'

import React, { useRef } from 'react';
import { useFormState } from 'react-dom';
import { emailSignupAction } from '../actions';
import SubmissionAlert from '@/components/SubmissionAlert';

export default function Form() {
  const [state, formAction] = useFormState(emailSignupAction, { errors: [] });
  const nameErrors = findErrors("name", state?.errors);
  const emailErrors = findErrors("email", state?.errors);
  
  const formRef = useRef<HTMLFormElement | null>(null)

  return (
    <>
      <SubmissionAlert formRef={formRef} formState={state} />
      <form ref={formRef} action={formAction} className="w-[80%] sm:w-full max-w-sm">
        <h1 className="font-bold py-8">Get Notified When There Is a New Upload.</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-white text-sm font-bold mb-2">
            Email:
          </label>  
          <input
            type="email"
            id="email"
            name='email'
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          />
          <ErrorMessages errors={emailErrors} />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          />
          <ErrorMessages errors={nameErrors} />
        </div>
        <div className="mb-4">
          <label htmlFor="beatstars" className="block text-white text-sm font-bold mb-2">
            Beatstars (if applicable):
          </label>
          <input
            type="text"
            id="beatstars"
            name="beatstars"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-transparent border-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

const ErrorMessages = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;

  const text = errors.join(", ");

  return <div className="text-red-600 peer">{text}</div>;
};

const findErrors = (fieldName: string, errors: any) => {
  if(!errors) {
    return []
  }
  return errors
    .filter((item) => {
      return item.path.includes(fieldName);
    })
    .map((item) => item.message);
};