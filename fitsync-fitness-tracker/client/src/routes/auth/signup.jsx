import { createFileRoute }from '@tanstack/react-router'
import { RegistrationPage } from '../../features/registration/pages/RegistrationPage';

export const Route = createFileRoute('/auth/signup')({
  component: RegistrationPage,
});
