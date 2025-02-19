'use server';

import bcrypt from 'bcryptjs';

export async function hashPassword(password: string, saltOrRounds: number) {
    return bcrypt.hash(password, saltOrRounds);
}