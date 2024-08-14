import { NextResponse } from "next/server";
import OpenAI from 'openai'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it.  Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards": [
  ``{
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

export async function POST(req) {
  const openai = new OpenAI(process.env.OPENAI_API_KEY)
  const data = await req.text()

  if (!data.trim()) {
    return NextResponse.json({ error: 'Please enter some text to generate flashcards.' }, { status: 400 })
  }

  // Open API Call Here!!!
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'usere', content: data },
      ],
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
    })
    // Process API Response Here!!!
    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards)
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({ error: 'An error occurred while generating flashcards. Please try again.' }, { status: 500 })
  }

}