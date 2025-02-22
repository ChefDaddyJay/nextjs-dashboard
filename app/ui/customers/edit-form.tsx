'use client';

import { Customer } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateCustomer, CustomerState } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function EditCustomerForm({customer}: {customer: Customer}) {
  const initialState: CustomerState = { message: null, errors: {} };
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const [state, formAction] = useActionState(updateCustomerWithId, initialState);
  
  return (
    <form action={formAction}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6" aria-describedby="form-error">
        {/* Customer Name */}
        <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Customer Name
            </label>
            <div className="relative">
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Customer Name"
                    defaultValue={customer.name}
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
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Customer Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={customer.email}
                placeholder="Customer Email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
              />
            </div>
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {'Please enter an email for the customer.'}
                </p>
            ))}
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
      <input
        id="imageURL"
        name="imageURL"
        type="hidden"
        value={customer.image_url}
      />
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Customer</Button>
      </div>
    </form>
  );
}
