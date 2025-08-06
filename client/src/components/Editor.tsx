"use client";

import SnippetsModal from "@/components/SnippetsModal";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import EditorToolbar from "./Editor/EditorToolbar";
import EditorPanel from "@/components/Editor/LiveCodeEditor";
import ChatPanel from "./Editor/ChatSidebar";
import FileExplorer from "./Editor/FileExplorer";

import type { Socket } from "socket.io-client";

// Types
interface Props {
  roomId: string;
}

interface ChatMessage {
  user: string;
  message: string;
  image?: string;
}

interface FileData {
  name: string;
  language: string;
  content: string;
}

const supportedLanguages = [
  "CPP",
  "JAVA",
  "JAVASCRIPT",
  "TYPESCRIPT",
  "PYTHON",
  "CSHARP",
  "C",
  "Go",
  "PHP",
];

export default function CodeEditor({ roomId }: Props) {
  const [files, setFiles] = useState<Record<string, FileData>>({
    "main.cpp": { name: "main.cpp", language: "CPP", content: "// Start coding..." },
  });
  const [activeFile, setActiveFile] = useState("main.cpp");
  const [showSnippetsModal, setShowSnippetsModal] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [editorTypingUsers, setEditorTypingUsers] = useState<string[]>([]);
  const [participants, setParticipants] = useState<{ id: string; name: string; image?: string }[]>([]);
  const [output, setOutput] = useState("");

  const { data: session } = useSession();
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const activeFileData = files[activeFile];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    if (session?.user) {
      socket.emit("join-room", {
        roomId,
        user: { name: session.user.name, image: session.user.image },
      });
    }

    socket.on("initial-files", (initialFiles: Record<string, FileData>) => {
      setFiles(initialFiles);
      setActiveFile(Object.keys(initialFiles)[0]);
    });

    socket.on("file-update", ({ filename, content }) => {
      setFiles((prev) => ({
        ...prev,
        [filename]: { ...prev[filename], content },
      }));
    });

    socket.on("file-added", (file: FileData) => {
      console.log("file-added", file);
      setFiles((prev) => ({ ...prev, [file.name]: file }));
    });

    socket.on("file-deleted", (filename: string) => {
      setFiles((prev) => {
        const updated = { ...prev };
        delete updated[filename];
        const newActive = Object.keys(updated)[0];
        setActiveFile((prevActive) => (prevActive === filename ? newActive : prevActive));
        return updated;
      });
    });

    socket.on("file-renamed", ({ oldName, newName }) => {
      setFiles((prev) => {
        const updated = { ...prev };
        const file = updated[oldName];
        if (!file) return prev;
        updated[newName] = { ...file, name: newName };
        delete updated[oldName];
        setActiveFile((prevActive) => (prevActive === oldName ? newName : prevActive));
        return updated;
      });
    });

    socket.on("chat-message", ({ user, message, image }: ChatMessage) => {
      setMessages((prev) => [...prev, { user, message, image }]);
    });

    socket.on("chat-typing", (user: string) => {
      setTypingUsers((prev) => (!prev.includes(user) ? [...prev, user] : prev));
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u !== user));
      }, 3000);
    });

    socket.on("editor-typing", ({ user, filename }) => {
  if (filename !== activeFile) return; // Only show typing if it’s for current file
  setEditorTypingUsers((prev) =>
    !prev.includes(user) ? [...prev, user] : prev
  );
  setTimeout(() => {
    setEditorTypingUsers((prev) => prev.filter((u) => u !== user));
  }, 3000);
});


    socket.on("participants-update", (users) => {
      setParticipants(users);
    });
console.log(activeFileData);
    return () => {
      socket.off("initial-files");
      socket.off("file-update");
      socket.off("file-added");
      socket.off("file-deleted");
      socket.off("file-renamed");
      socket.off("chat-message");
      socket.off("chat-typing");
      socket.off("editor-typing");
      socket.off("participants-update");
    };
  }, [roomId, session?.user]);

  const handleEditorChange = (value: string | undefined) => {
    const content = value || "";
    setFiles((prev) => ({
      ...prev,
      [activeFile]: { ...prev[activeFile], content },
    }));
    socketRef.current?.emit("file-update", { roomId, filename: activeFile, content });
    handleEditorTyping();
  };

  const addFile = (name: string, language: string) => {
    if (files[name]) return;
    const newFile = { name, language, content: "" };
    setFiles((prev) => ({ ...prev, [name]: newFile }));
    setActiveFile(name);
    socketRef.current?.emit("file-add", { roomId, filename: name, language });
  };

  const deleteFile = (name: string) => {
    setFiles((prev) => {
      const updated = { ...prev };
      delete updated[name];
      const newActive = Object.keys(updated)[0];
      setActiveFile((prevActive) => (prevActive === name ? newActive : prevActive));
      return updated;
    });
    socketRef.current?.emit("file-delete", { roomId, filename: name });
  };

  const renameFile = (oldName: string, newName: string) => {
    if (!files[oldName] || files[newName]) return;
    setFiles((prev) => {
      const updated = { ...prev };
      const file = updated[oldName];
      updated[newName] = { ...file, name: newName };
      delete updated[oldName];
      setActiveFile((prevActive) => (prevActive === oldName ? newName : prevActive));
      return updated;
    });
    socketRef.current?.emit("file-rename", { roomId, oldName, newName });
  };

  const runCode = async () => {
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: activeFileData.language,
          code: activeFileData.content,
        }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || "No output");
    } catch {
      setOutput("Execution failed.");
    }
  };

  const handleChatTyping = () => {
    if (session?.user?.name) {
      socketRef.current?.emit("chat-typing", {
        roomId,
        user: session.user.name,
      });
    }
  };

const handleEditorTyping = () => {
  if (session?.user?.name) {
    socketRef.current?.emit("editor-typing", {
      roomId,
      user: session.user.name,
      filename: activeFile,
    });
  }
};


  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !session?.user?.name) return;

    const newMessage: ChatMessage = {
      user: session.user.name,
      message: chatInput,
      image: session.user.image || "",
    };

    socketRef.current?.emit("chat-message", { roomId, ...newMessage });
    setMessages((prev) => [...prev, newMessage]);
    setChatInput("");
  };

  const handleCopyRoomLink = async () => {
    const link = `${window.location.origin}/editor/${roomId}`;
    try {
      await navigator.clipboard.writeText(link);
      alert("Room link copied to clipboard!");
    } catch {
      alert("Failed to copy link");
    }
  };

  const leaveRoom = () => {
    router.push("/");
  };

  return (
    <div className="flex h-full gap-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
      <FileExplorer
        files={files}
        activeFile={activeFile}
        onSelectFile={setActiveFile}
        onAddFile={addFile}
        onDeleteFile={deleteFile}
        onRenameFile={renameFile}
      />

      {/* Code Section */}
      <div className="w-full flex flex-col p-4 space-y-4">
        <EditorToolbar
          language={activeFileData.language}
          setLanguage={(lang) => {
            const updated = {
              ...files,
              [activeFile]: { ...files[activeFile], language: lang },
            };
            setFiles(updated);
            // Optionally emit a language-change event
          }}
          onSave={() => setShowSnippetsModal(true)}
          onRun={runCode}
          onCopyLink={handleCopyRoomLink}
        />

        <EditorPanel
          code={activeFileData.content}
          language={(activeFileData.language).toUpperCase()}
          onCodeChange={handleEditorChange}
          editorTypingUsers={editorTypingUsers}
          output={output}
        />
      </div>

      {/* Chat Sidebar */}
      <ChatPanel
        participants={participants}
        messages={messages}
        typingUsers={typingUsers}
        chatInput={chatInput}
        setChatInput={setChatInput}
        sendMessage={sendMessage}
        onTyping={handleChatTyping}
        onLeave={leaveRoom}
      />

      {/* Save Snippet */}
      <SnippetsModal
        open={showSnippetsModal}
        onClose={() => setShowSnippetsModal(false)}
        initialCode={activeFileData.content}
        language={activeFileData.language}
      />
    </div>
  );
}
