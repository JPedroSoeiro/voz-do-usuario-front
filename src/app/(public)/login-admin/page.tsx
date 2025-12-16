import { LoginAdm } from "./_components/login-admin";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-blue-50">
      <div className="w-full max-w-sm">
        <LoginAdm />
      </div>
    </div>
  );
}
