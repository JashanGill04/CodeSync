// src/app/api/execute/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// Optional: move to .env
const clientId = process.env.JDOODLE_CLIENTID;
const clientSecret = process.env.JDOODLE_CLIENTSECRET;

export async function POST(req: NextRequest) {
  const { language, code, roomId, user } = await req.json()

  const languageMap: Record<string, string> = {
    JAVASCRIPT: 'nodejs',
    PYTHON: 'python3',
    JAVA: 'java',
    CPP: 'cpp17',
    TYPESCRIPT:'typescript',
    CSharp :'csharp', 
    C: 'c',
    GO:'go',
    PHP:'php',

  }

  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      script: code,
      language: languageMap[language] || 'nodejs',
      versionIndex: '0',
      clientId,
      clientSecret,
    })

    return NextResponse.json(response.data)
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Execution error:', err.message)
    } else {
      console.error('Execution error:', err)
    }
    return NextResponse.json({ error: 'Execution failed' }, { status: 500 })
  }
}
