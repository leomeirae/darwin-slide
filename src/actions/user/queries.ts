'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client';

export const findUser = async (clerkId: string) => {
  return await prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      subscription: true,
      integrations: {
        select: {
          id: true,
          token: true,
          expiresAt: true,
          name: true,
        },
      },
    },
  })
}

export const createUser = async (
  clerkId: string,
  firstname: string,
  lastname: string,
  email: string
) => {
  try {
    return await prisma.user.create({
      data: {
        clerkId,
        firstname,
        lastname,
        email,
        subscription: {
          create: {},
        },
      },
      select: {
        firstname: true,
        lastname: true,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return await prisma.user.findUnique({
        where: { email },
        select: {
          firstname: true,
          lastname: true,
        },
      });
    }
    throw error;
  }
};

export const updateSubscription = async (
  clerkId: string,
  props: { customerId?: string; plan?: 'PRO' | 'FREE' }
) => {
  return await prisma.user.update({
    where: {
      clerkId,
    },
    data: {
      subscription: {
        update: {
          data: {
            ...props,
          },
        },
      },
    },
  })
}
