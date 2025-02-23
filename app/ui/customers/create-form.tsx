'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createCustomer, CustomerState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import { UploadImage } from './buttons';

export default function Form() {
  const initialState: CustomerState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCustomer, initialState);
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [imageURL, setURL] = useState('/customers/default.png');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch(e.target.id) {
      case 'name': setName(e.target.value); break;
      case 'email': setEmail(e.target.value); break;
    }
  };
  
  const updateURL = (url: string) => {
    setURL(url);
  }

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6" aria-describedby="form-error">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Customer Name"
              defaultValue={name}
              onChange={handleChange}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
            />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {'Please enter a name for the customer.'}
              </p>
            ))}
          </div>
        </div>

        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Customer Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Customer Email"
                defaultValue={email}
                onChange={handleChange}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
              />
            </div>
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
            ))}
          </div>
        </div>

        {/* Customer image */}
        <div className="mb-4">
          <label htmlFor="imageFile" className="mb-2 block text-sm font-medium">
            Customer Image
          </label>
          <div className="relative mt-2 rounded-md">
            <img src={imageURL} width="60" height="60" />
            <input id="imageURL" name="imageURL" type="hidden" value={imageURL} />
            <UploadImage onUpload={updateURL} />
          </div>
        </div>
      </div>

      <div id="form-error" aria-live="polite" aria-atomic="true">
        {state.errors?.name &&
          state.errors.name.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {'Missing fields. Failed to create customer.'}
            </p>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  );
}
