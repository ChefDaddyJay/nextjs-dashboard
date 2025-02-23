'use client';

import { PencilIcon, PlusIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Customer</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/customers/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function UploadImage({onUpload}:{onUpload: (url: string) => void}) {
  const [file, setFile] = useState<File>();

  const uploadFile = async () => {
    if(!file) {
      alert('No file selected');
      return;
    }

    try {
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch('/api/files', {
        method: "POST",
        body: data
      });
      const ipfsUrl = await uploadRequest.json();
      onUpload(ipfsUrl);
    } catch(e) {
      console.log(e);
      alert("Trouble uploading the file.");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  }

  return (
    <div className="mb-4">
      <label htmlFor="imageFile" className="mb-2 block text-sm font-medium">
        Customer Image
      </label>
      <div className="relative mt-2 rounded-md">
        <input type="file" onChange={handleChange} />
        <button type="button" className="rounded-md border p-2 hover:bg-gray-100" onClick={uploadFile}>
          <span className="sr-only">Upload</span>
          <ArrowUpOnSquareIcon className="w-5" />
        </button>
      </div>
    </div>
  )
}