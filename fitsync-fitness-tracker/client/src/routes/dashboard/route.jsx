import { createFileRoute, redirect } from '@tanstack/react-router'
import { fetchAuthUser } from '../../services/fetchAuthUser';
import DefaultNav from '../../layout/DefaultNav';

export const Route = createFileRoute('/dashboard')({
    loader: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData({
            queryKey: ['authUser'],
            queryFn: fetchAuthUser,
            retry: true,
        });
        context.userStore.actions.setUsername(user.username);
        context.userStore.actions.setPublicId(user.publicId);

        } catch {
            context.userStore.actions.resetUser();
            throw redirect({ to: '/auth/login' })
        }
    },
  component: dashboard,
})

function dashboard() {

  const navLinks = [
    { label: "Dashboard", path: "/dashboard/" },
    { label: "Workout Creator", path: "/dashboard/workoutCreator" },
    { label: "Workouts", path: "/dashboard/workouts"},
    { label: "Record a Meal", path: "/dashboard/mealCreator"},
    { label: "Meals", path: "/dashboard/meals"},
  ];

  return (
    <>
      <DefaultNav  links={navLinks}/>
    </>
  )
}