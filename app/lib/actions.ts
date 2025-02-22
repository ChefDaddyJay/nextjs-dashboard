'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const InvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "Please select a customer."
    }).min(1),
    amount: z.coerce
        .number()
        .gt(0, "Please enter an amount greater than $0."),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: "Please select an invoice status."
    }),
    date: z.string()
});
const CreateInvoice = InvoiceFormSchema.omit({id: true, date: true});
const UpdateInvoice = InvoiceFormSchema.omit({id: true, date: true});

const CustomerFormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: "Please enter a customer name."
    }).min(1),
    email: z.string({
        invalid_type_error: "Please enter a valid email."
    }).email(),
    imageURL: z.string().startsWith("/customers/")
});
const CreateCustomer = CustomerFormSchema.omit({id: true});
const UpdateCustomer = CustomerFormSchema.omit({id: true});
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type InvoiceState = {
    errors?: {
        customerId?: string[],
        amount?: string[],
        status?: string[]
    },
    message?: string | null
}

export type CustomerState = {
    errors?: {
        name?: string[],
        email?: string[],
        imageURL?: string[]
    },
    message?: string | null
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if(error instanceof AuthError) {
            switch(error.type) {
                case 'CredentialsSignin': 
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function createInvoice(prevState: InvoiceState, formData:FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });

    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
            };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    
    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch(error) {
        console.log(error);
        return {
            message: "Database error: Failed to create invoice."
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: InvoiceState, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });
    console.log(validatedFields);

    if(!validatedFields.success) {
        console.log('validation error');
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.'
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch(error) {
        console.log(error);
        return {
            message: 'Database Error. Failed to Update Invoice.'
        };
    }
    console.log('Updated invoice');

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');   
}

export async function deleteInvoice(id:string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}

export async function createCustomer(prevState: CustomerState, formData:FormData) {
    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        imageURL: '/customers/default.png'
    });

    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Customer.',
        };
    }

    const { name, email, imageURL } = validatedFields.data;
    
    try {
        await sql`
            INSERT INTO customers (name, email, image_url)
            VALUES (${name}, ${email}, ${imageURL})
        `;
    } catch(error) {
        console.log(error);
        return {
            message: "Database error: Failed to create customer."
        };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function updateCustomer(id: string, prevState: CustomerState, formData: FormData) {
    const validatedFields = UpdateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        imageURL: formData.get('imageURL')
    });

    if(!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.'
        };
    }

    const { name, email, imageURL } = validatedFields.data;

    try {
        await sql`
            UPDATE customers
            SET name = ${name}, email = ${email}, image_url = ${imageURL}
            WHERE id = ${id}
        `;
    } catch(error) {
        console.log(error);
        return {
            message: 'Database Error. Failed to Update Customer.'
        };
    }
    console.log('Updated customer');

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');   
}

export async function deleteCustomer(id:string) {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath('/dashboard/customers');
}