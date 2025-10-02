"use server";
import {auth} from "@/auth";
import {db} from "@/lib/db";
import {PrismaAdapter} from "@auth/prisma-adapter";

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: {id},
            include: {accounts: true}
        });
        return user;
    } catch (error) {
        return null;
    }
};


export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await db.account.findFirst({
            where: {userId},
            include: {user: true}
        });
        return account;
    } catch (error) {
        return null;
    }
};

export const currentUser = async () => {
    const user = await auth();
    return user?.user;
}