// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { executePrompt } from '@/server/services/chat.service'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  response: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt } = req.query
  console.log(prompt)
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  })
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser() 

  if (!user?.id) throw new Error('User not found')
  if (!prompt) throw new Error('Prompt not found')
  
  const response = await executePrompt(prompt as string, user.id)
  res.status(200).json({ response })
}
