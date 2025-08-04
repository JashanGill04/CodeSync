'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const supportedLanguages = [
  'CPP', 'JAVA', 'JAVASCRIPT', 'TYPESCRIPT', 'PYTHON', 'CSHARP', 'C', 'Go', 'PHP'
]

type Props = {
  language: string
  setLanguage: (lang: string) => void
  onSave: () => void
  onRun: () => void
  onCopyLink: () => void
}

export default function EditorToolbar({
  language,
  setLanguage,
  onSave,
  onRun,
  onCopyLink,
}: Props) {
  return (
    <div className="w-full flex flex-wrap items-center text-white justify-between gap-4 bg-[#0c0c1d] px-4 py-3 rounded-xl shadow border border-white/10">
      
      {/* Language Selector */}
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-[180px] bg-[#0c0c1d] text-white border border-white/20 hover:border-white/40">
          <SelectValue placeholder="Select Language"  />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a2e] text-white border-white/10">
          {supportedLanguages.map((lang) => (
            <SelectItem
              key={lang}
              value={lang}
              className="hover:bg-violet-600/10 focus:bg-violet-600/20"
            >
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Button Group */}
      <div className="flex gap-4 flex-wrap">
        <Button
          onClick={onSave}
          className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-5 py-2 rounded-md shadow"
        >
          💾 Save Current Code
        </Button>

        <Button
          onClick={onRun}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-md shadow"
        >
          Run
        </Button>

        <Button
          onClick={onCopyLink}
          variant="outline"
          className="border-white/20 text-white bg-[#0c0c1d] hover:bg-white/10 font-medium px-5 py-2 rounded-md"
        >
          Copy Room Link
        </Button>
      </div>
    </div>
  )
}
