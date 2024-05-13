'use client'

import 'filepond/dist/filepond.min.css'
import { useState } from 'react'
import { FilePond } from 'react-filepond'
import revalidatePhotosAction from '../../actions/revalidatePhotos'

type Props = {
  uploadPath: string
  headers?: { [key: string]: string }
  uploadButtonText?: string
  helper?: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  required?: boolean
}

export const UploadField = ({
  helper = 'Drag & Drop your files or <span class="filepond--label-action">Browse</span>',
  accept = 'image/*',
  multiple = false,
  maxFiles = 1,
  required = false,
  uploadPath,
  headers,
}: Props) => {
  const [files, setFiles] = useState([])

  return (
    <FilePond
      files={files}
      server={{
        process: {
          url: uploadPath,
          headers: headers,
          method: 'POST',
          onload: (response) => {
            revalidatePhotosAction()
            return response[0].id
          },
        },
      }}
      // acceptedFileTypes={[accept]}
      // @ts-ignore
      onupdatefiles={setFiles}
      onprocessfile={(error, file) => {
        setTimeout(() => {
          setFiles([])
        }, 1000)
      }}
      // maxTotalFileSize={`${process.env.MAX_TOTAL_FILE_SIZE_IN_MB ?? 10}MB`}
      labelIdle={helper}
      allowImagePreview
      allowFileSizeValidation
      maxFileSize={`${process.env.MAX_FILE_TOTAL_SIZE_IN_MB ?? 10}MB`}
      allowRevert={false}
    />
  )
}
