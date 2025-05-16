import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import React, { useRef, useState } from "react"

interface DropzoneProps {
  onChange: React.Dispatch<React.SetStateAction<File[]>>
  className?: string
}

export function Dropzone({ onChange, className, ...props }: DropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileInfo, setFileInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const { files } = e.dataTransfer
    handleFiles(files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files) {
      handleFiles(files)
    }
  }

  const handleFiles = (files: FileList) => {
    const uploadedFile = files[0]
    const fileSizeInKB = Math.round(uploadedFile.size / 1024)
    onChange(() => Array.from(files))
    setFileInfo(`Feltöltendő: ${uploadedFile.name} (${fileSizeInKB} KB)`)
    setError(null)
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Card
      className={`border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50 ${className}`}
      {...props}
      onClick={handleButtonClick}
    >
      <CardContent className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs" onDragOver={handleDragOver} onDrop={handleDrop}>
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="font-medium">Húzz egy fájlt ide</span>
          <Button variant="ghost" size="sm" className="ml-auto flex h-8 space-x-2 px-0 pl-1 text-xs">
            vagy kattints ide
          </Button>
          <input ref={fileInputRef} type="file" onChange={handleFileInputChange} className="hidden" multiple />
        </div>
        {fileInfo && <p className="text-muted-foreground text-center">{fileInfo}</p>}
        {error && <span className="text-red-500">{error}</span>}
      </CardContent>
    </Card>
  )
}
