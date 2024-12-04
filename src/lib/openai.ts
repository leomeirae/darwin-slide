import OpenAi from 'openai'

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables')
}

export const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
})
