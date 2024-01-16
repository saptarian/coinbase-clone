import toast from 'react-hot-toast'
import { queryClient } from '@/lib/queries'
import { createOrder, completeOrder } from '@/lib/server'
import type { ActionFunctionArgs } from 'react-router-dom'


export const placeOrder = async (
  { request }: ActionFunctionArgs
) => 
{
  const formData = Object.fromEntries(
    await request.formData()
  ) as {[K in string]: string}

  if (!formData.total || parseFloat(formData.total) <= 0.00 )
  {
    toast("Please enter positif value")
    return { ok: false }
  }

  const resp = await createOrder(formData)
  .then((resp) => resp.data)
  .catch(e => {
    toast(e.message)
    return null
  })

  return resp ? 
    {order: { ...resp, ...formData }, ok: true}
    : { ok: false }
}


export const updateOrder = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(
    await request.formData()
  ) as {[K in string]: string}

  if (!formData.uuid && formData.uuid.length < 9) {
    toast("Something went wrong")
    return { ok: false }
  }

  const resp = await completeOrder(formData)
  .then((resp) => resp.data)
  .catch(e => {
    toast(e.message)
    return { ok: false } 
  })

  // TODO: Invlidate query, remove wallets query
  queryClient.removeQueries({ queryKey: ['wallet', 'list'] })
  queryClient.invalidateQueries({ queryKey: ['wallet'] })
  queryClient.invalidateQueries({ queryKey: ['transaction'] })

  return resp ?
    {order: { ...resp, done: true }, ok: true}
    : { ok: false }
}
