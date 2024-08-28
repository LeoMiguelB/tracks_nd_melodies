'use server'
import { z } from 'zod'
import { redirect } from 'next/navigation';
import { supabase } from '../supabase';

const schema = z.object({
  email: z.string().email().min(1, "email cannot be empty"),
  name: z.string().min(1, "name cannot be empty."),
  title: z.string().min(1, "name cannot be empty."),
  description: z.string().min(1, "name cannot be empty."),
})

export async function contactAction(prevState: any, formData: FormData) {

  const validation = schema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    title: formData.get('title'),
    description: formData.get('description'),
  });

  const rawFormData = {
    email: formData.get('email'),
    request_type: formData.get('request-type'),
    name: formData.get('name'),
    description: formData.get('description'),
    title: formData.get('title'),
  }

  const { error } = await supabase
  .from('issue_feature_requests')
  .insert(rawFormData)

  if (validation.success) {
    // save the data, send an email, etc.
    return {
      status: 'success',
      errors: null
    }
  } 
  
  return {
    status: 'error',
    errors: validation.error.issues
  };
}