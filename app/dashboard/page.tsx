import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AddNewButton from "@/features/dashboard/actions/components/add-new-button";
import AddRepo from "@/features/dashboard/actions/components/add-repo-button";
import ProjectTable from "@/features/dashboard/actions/components/project-table";
import { DashboardSidebar } from "@/features/dashboard/actions/components/dashboard-sidebar";
import { getAllPlaygroundForUser, deleteProjectById, editProjectById, duplicateProjectById } from "@/features/playground/actions";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <img src="/empty-state.svg" alt="No projects" className="w-48 h-48 mb-4" />
    <h2 className="text-xl font-semibold text-gray-500">No projects found</h2>
    <p className="text-gray-400">Create a new project to get started!</p>
  </div>
);

const DashboardPage = async () => {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/sign-in");
  }

  const playgrounds = await getAllPlaygroundForUser();
  
  // Transform playgrounds for sidebar
  const playgroundData = playgrounds.map((playground) => ({
    id: playground.id,
    name: playground.title,
    icon: "Code2", // Default icon, you can customize based on template
    starred: playground.starMarks?.some(mark => mark.isMarked) || false,
  }));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <DashboardSidebar initialPlaygroundData={playgroundData} />
        <SidebarInset className="flex-1">
          <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10">
            <div className="w-full mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.user?.name}!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <AddNewButton />
              <AddRepo />
            </div>
            
            <div className="mt-10 flex flex-col justify-center items-center w-full">
              {playgrounds && playgrounds.length === 0 ? (
                <EmptyState />
              ) : (
                // @ts-ignore
                <ProjectTable
                  projects={playgrounds || []}
                  onDeleteProject={deleteProjectById}
                  onUpdateProject={editProjectById}
                  onDuplicateProject={duplicateProjectById}
                />
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage;