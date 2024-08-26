'use server'
import { z } from 'zod'
import { redirect } from 'next/navigation';
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
    email: formData.get('email'),
    name: formData.get('name'),
    beatstars_username: formData.get('beatstars'),
  }

  // TODO: best to perform raw queries instead, more control over sanitization
  const { error } = await supabase
  .from('email_list')
  .insert(rawFormData)

  if (validation.success) {
    // save the data, send an email, etc.
    redirect("/");
  } else {
    return {
      errors: validation.error.issues,
    };
  }
}