import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { logger } from './logger';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash) {
            logger.warn('Login attempt with invalid email', { email: credentials.email });
            return null;
          }

          const isValid = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (!isValid) {
            logger.warn('Login attempt with invalid password', { email });
            return null;
          }

          // Update last login (don't fail if this errors)
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLogin: new Date() },
            });
          } catch (updateError) {
            logger.warn('Failed to update last login', { error: updateError, userId: user.id });
            // Continue anyway - this is not critical
          }

          logger.info('User logged in successfully', { userId: user.id, email: user.email });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          logger.error('Authentication error', { error, email: credentials?.email as string | undefined });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

