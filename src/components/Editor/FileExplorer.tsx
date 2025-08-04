'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';

type FileData = {
  name: string;
  language: string;
  content: string;
};

type Props = {
  files: Record<string, FileData>;
  activeFile: string;
  onSelectFile: (filename: string) => void;
  onAddFile: (filename: string, language: string) => void;
  onDeleteFile: (filename: string) => void;
  onRenameFile?: (oldName: string, newName: string) => void;
};

export default function FileExplorer({
  files,
  activeFile,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onRenameFile,
}: Props) {
  const [newFileName, setNewFileName] = useState('');
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  const handleAdd = () => {
    const trimmed = newFileName.trim();
    if (!trimmed || files[trimmed]) return;

    const ext = trimmed.split('.').pop()?.toLowerCase() || 'cpp';
    onAddFile(trimmed, ext);
    setNewFileName('');
  };

  const handleRenameSubmit = (oldName: string) => {
    const newName = renameInput.trim();
    if (!newName || newName === oldName || files[newName]) {
      setRenamingFile(null);
      return;
    }
    onRenameFile?.(oldName, newName);
    setRenamingFile(null);
  };

  return (
    <div className="w-56 bg-black/30 border-r border-white/10 p-3 text-sm text-white flex flex-col">
      <h3 className="font-semibold mb-2">Files</h3>

      <ul className="space-y-1 flex-1 overflow-y-auto">
        {Object.values(files).map((file) => (
          <li
            key={file.name}
            onClick={() => !renamingFile && onSelectFile(file.name)}
            className={`flex items-center justify-between px-2 py-1 rounded ${
              file.name === activeFile ? 'bg-violet-600 text-white' : 'hover:bg-white/10 cursor-pointer'
            }`}
          >
            {renamingFile === file.name ? (
              <input
                autoFocus
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                onBlur={() => handleRenameSubmit(file.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit(file.name);
                  if (e.key === 'Escape') setRenamingFile(null);
                }}
                className="bg-transparent text-white border border-white/20 px-1 text-sm w-full"
              />
            ) : (
              <>
                <span className="truncate flex-1">{file.name}</span>

                <div className="ml-2 flex items-center space-x-1">
                  { (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingFile(file.name);
                          setRenameInput(file.name);
                        }}
                        className="text-gray-300 hover:text-white"
                        title="Rename file"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFile(file.name);
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                        title="Delete file"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Input
          placeholder="New FileName"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="mb-2 text-white"
        />
        <Button className="w-full text-sm" onClick={handleAdd}>
          ➕ Add File
        </Button>
      </div>
    </div>
  );
}
