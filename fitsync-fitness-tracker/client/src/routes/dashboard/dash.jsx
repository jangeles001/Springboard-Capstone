import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchAuthUser } from "../../services/fetchAuthUser.js";
import { Dashboard } from "../../features/dashboard/components/Dashboard.jsx";

export const Route = createFileRoute('/dashboard/dash') ({
     loader: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData({
            queryKey: ['authUser'],
            queryFn: fetchAuthUser,
        });
        context.userStore.actions.setUsername(user.username);
        context.userStore.actions.setPublicId(user.publicId);

        } catch {
            context.userStore.actions.resetUser();
            throw redirect({ to: '/auth/login' })
        }
    },
    component: Dashboard,
});