"use server"
import { currentUser } from "@/features/auth/actions";
import { db } from "@/lib/db"
import { TemplateFolder } from "../libs/path-to-json";
import { revalidatePath } from "next/cache";

// Toggle marked status for a problem
export const toggleStarMarked = async (playgroundId: string, isChecked: boolean) => {
    const user = await currentUser();
    const userId = user?.id;
    
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        if (isChecked) {
            await db.starMark.create({
                data: {
                    userId: userId,
                    playgroundId,
                    isMarked: isChecked,
                },
            });
        } else {
            await db.starMark.delete({
                where: {
                    userId_playgroundId: {
                        userId,
                        playgroundId: playgroundId,
                    },
                },
            });
        }

        revalidatePath("/dashboard");
        return { success: true, isMarked: isChecked };
    } catch (error) {
        console.error("Error updating star mark:", error);
        return { success: false, error: "Failed to update star mark" };
    }
};

export const createPlayground = async (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
}) => {
    const { template, title, description } = data;

    const user = await currentUser();
    
    if (!user?.id) {
        throw new Error("User not authenticated");
    }

    try {
        const playground = await db.playground.create({
            data: {
                title: title,
                description: description,
                template: template,
                userId: user.id
            }
        });

        revalidatePath("/dashboard");
        return playground;
    } catch (error) {
        console.error("Error creating playground:", error);
        throw new Error("Failed to create playground");
    }
}

export const getAllPlaygroundForUser = async () => {
    try {
        const user = await currentUser();
        
        if (!user?.id) {
            return [];
        }

        const playgrounds = await db.playground.findMany({
            where: {
                userId: user.id
            },
            include: {
                user: true,
                starMarks: {
                    where: {
                        userId: user.id
                    },
                    select: {
                        isMarked: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return playgrounds;
    } catch (error) {
        console.error("Error getting playgrounds:", error);
        return [];
    }
}

export const getPlaygroundById = async (id: string) => {
    try {
        const playground = await db.playground.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                template: true,
                templateFiles: {
                    select: {
                        content: true
                    }
                }
            }
        });
        return playground;
    } catch (error) {
        console.error("Error getting playground by id:", error);
        return null;
    }
}

export const SaveUpdatedCode = async (playgroundId: string, data: TemplateFolder) => {
    const user = await currentUser();
    if (!user) return null;

    try {
        const updatedPlayground = await db.templateFile.upsert({
            where: {
                playgroundId,
            },
            update: {
                content: JSON.stringify(data),
            },
            create: {
                playgroundId,
                content: JSON.stringify(data),
            },
        });

        return updatedPlayground;
    } catch (error) {
        console.error("SaveUpdatedCode error:", error);
        return null;
    }
};

export const deleteProjectById = async (id: string): Promise<void> => {
    try {
        const user = await currentUser();
        
        if (!user?.id) {
            throw new Error("User not authenticated");
        }

        await db.playground.delete({
            where: { 
                id,
                userId: user.id // Ensure user owns the playground
            }
        });
        
        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Error deleting playground:", error);
        throw new Error("Failed to delete playground");
    }
}

export const editProjectById = async (id: string, data: { title: string, description: string }): Promise<void> => {
    try {
        const user = await currentUser();
        
        if (!user?.id) {
            throw new Error("User not authenticated");
        }

        await db.playground.update({
            where: { 
                id,
                userId: user.id // Ensure user owns the playground
            },
            data: {
                title: data.title,
                description: data.description,
                updatedAt: new Date()
            }
        });
        
        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Error editing playground:", error);
        throw new Error("Failed to edit playground");
    }
}

export const duplicateProjectById = async (id: string): Promise<void> => {
    try {
        const user = await currentUser();
        
        if (!user?.id) {
            throw new Error("User not authenticated");
        }

        // Fetch the original playground data
        const originalPlayground = await db.playground.findUnique({
            where: { 
                id,
                userId: user.id // Ensure user owns the playground
            },
            include: {
                templateFiles: true,
            },
        });

        if (!originalPlayground) {
            throw new Error("Original playground not found");
        }

        // Create a new playground with the same data but a new ID
        await db.playground.create({
            data: {
                title: `${originalPlayground.title} (Copy)`,
                description: originalPlayground.description,
                template: originalPlayground.template,
                userId: originalPlayground.userId,
                templateFiles: {
                    create: originalPlayground.templateFiles.map((file) => ({
                        content: file.content as any,
                    })),
                },
            },
        });

        // Revalidate the dashboard path to reflect the changes
        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Error duplicating project:", error);
        throw new Error("Failed to duplicate project");
    }
};