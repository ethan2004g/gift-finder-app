import NextAuth from 'next-auth';
import { authOptions } from './auth';

export const { handlers, auth } = NextAuth(authOptions);

