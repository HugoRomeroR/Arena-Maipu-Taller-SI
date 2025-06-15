import { redirect } from 'next/navigation';
export default function InicioRedirect() {
  return (
    redirect(`/inicio/`)
  );
}
// Este componente redirige a la página de inicio de Arena Maipú