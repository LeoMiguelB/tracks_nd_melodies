'use server'
import { z } from 'zod'
import { supabase } from '../supabase';

const schema = z.object({
  email: z.string().email().min(1, "email cannot be empty"),
  name: z.string().min(1, "name cannot be empty.")
})

export async function emailSignupAction(prevState: any, formData: FormData) {

  const validation = schema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
  });

  const rawFormData = {
    email: String(formData.get('email')),
    name: String(formData.get('name')),
    beatstars_username: String(formData.get('beatstars')),
  }

  // TODO: best to perform raw queries instead, more control over sanitization
  const { error } = await supabase
  .from('email_list')
  .insert(rawFormData)

  if (validation.success) {
    // save the data, send an email, etc.
    return {
      status: 'success',
      errors: null,
    }
  } 

  return {
    status: 'error',
    errors: validation.error.issues,
  };
}