'use server'
import Form from './components/Form'
export default async function Page()  {
  return (
    <main className="flex flex-col items-center justify-between pt-10 h-[660px] sm:h-[760px]">
      <Form />
    </main>
  );
}

