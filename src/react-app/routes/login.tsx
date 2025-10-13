import { createFileRoute } from '@tanstack/react-router'
import { FormLogin } from '@/components/FormLogin'
import logoAGA from "@/assets/Logo_AGA.png";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from 'lucide-react';


export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

const alert_comp = (title: string, description: string) => {
  const alertDiv = document.querySelector('#alert-box') as HTMLDivElement;
  if (alertDiv) {
    alertDiv.classList.remove('hidden');
    const alertTitle = alertDiv.querySelector('#login-error-title') as HTMLDivElement;
    const alertDescription = alertDiv.querySelector('#login-error-description') as HTMLDivElement;
    if (alertTitle) alertTitle.textContent = title;
    if (alertDescription) alertDescription.textContent = description;
  }
}

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen m-0 p-0">
      <section className="flex flex-col max-w-200 md:w-9/12 w-11/12 bg-background dark:bg-neutral-800 rounded-lg shadow-md">
        <div className="flex items-center md:gap-7 gap-4 bg-neutral-700 dark:bg-neutral-900 text-white p-7 rounded-t-lg">
          <img className="h-15 ml-auto" src={logoAGA} alt="Logo" />
          <h1 className='md:text-4xl text-3xl mr-auto'>Productos AGA</h1>
        </div>
        <div id="alert-box" className="mx-10 mt-5 hidden">
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle id="login-error-title">Error de inicio de sesión</AlertTitle>
            <AlertDescription id="login-error-description">
              Por favor verifica tus credenciales y vuelve a intentarlo.
            </AlertDescription>
          </Alert>
        </div>
        <div className='mx-auto mb-10 mt-5'>
          <FormLogin makeLogin={(loginData) => { 
            fetch('/api/auth/login',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
              })
              .then(response => response.json())
              .then(data => {
                if (data.error) {
                  // alert("Login error: " + data.error);
                  // Add alert component
                  alert_comp("Error de inicio de sesión", data.error);
                } else {
                  console.log("Login successful:", data);
                  localStorage.setItem('JWT_TOKEN', data.token);
                  console.log(window.location.search)
                  if (window.location.search) {
                    window.location.href = window.location.search.split('=')[1];
                  } else {
                    window.location.href = '/';
                  }
                }
              })
              .catch(error => {
                console.error("Error:", error);
              });
           }} />
        </div>
      </section>
    </div>
  )
}
