'use client'

import { useRef, useState, useEffect } from 'react';
import React from 'react';
import { useFormState } from 'react-dom';
import { emailSignupAction } from '../actions';
import {
  BtnBold,
  BtnItalic,
  BtnLink,
  BtnUndo,
  BtnRedo,
  Editor,
  EditorProvider,
  Toolbar
} from 'react-simple-wysiwyg';
import SubmissionAlert from '@/components/SubmissionAlert';


export default function Form() {
  const [state, formAction] = useFormState(emailSignupAction, null);
  const [editorValue, setEditorValue] = useState("");

  const nameErrors = findErrors("name", state?.errors);
  const emailErrors = findErrors("email", state?.errors);
  const titleErrors = findErrors("title", state?.errors);
  const descriptionErrors = findErrors("description", state?.errors);
  
  // SubmissionAlert comp only clears uncontrolled, the test editor is controlled hence to clear it hear manually
  useEffect(() => {if(state?.status == 'success') setEditorValue("")}, [state])

  const formRef = useRef<HTMLFormElement | null>(null)

  return (
    <>
      <SubmissionAlert formRef={formRef} formState={state} />
      <form ref={formRef} action={formAction} className="w-[80%] sm:w-full max-w-sm flex gap-8 flex-col">
        <h1 className="font-bold py-4">Submit an issue or a feature request.</h1>
        <div>
          <label htmlFor="request-type" className="block text-white text-sm font-bold mb-2">
            Type:
          </label>
          <select name="request-type" id="request-type" className="bg-black border-[.5px] rounded-md p-1">
            <option value="issue">
              Issue
            </option>
            <option value="feature">
              Feature
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="title" className="block text-white text-sm font-bold mb-2">
            Title (Max 30 Characters):
          </label>
          <input
            minLength={1}
            maxLength={30}
            type="text"
            id="title"
            name="title"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          />
          <ErrorMessages errors={titleErrors} />
        </div>
        <div>
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
        <div>
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
        <div>
          <label htmlFor="description" className="block text-white text-sm font-bold mb-2">
            Description:
          </label>
          <input
            type="hidden"
            id="description"
            name="description"
            value={editorValue}
          />
          <EditorProvider>
            <Editor value={editorValue} onChange={(t) => setEditorValue(t.target.value)}>
              <Toolbar>
                <BtnBold />
                <BtnItalic />
                <BtnLink />
                <BtnUndo />
                <BtnRedo />
              </Toolbar>
            </Editor>
          </EditorProvider>
          <ErrorMessages errors={descriptionErrors} />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-transparent border-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
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
  if (!errors) {
    return []
  }

  return errors
    .filter((item) => {
      return item.path.includes(fieldName);
    })
    .map((item) => item.message);
};