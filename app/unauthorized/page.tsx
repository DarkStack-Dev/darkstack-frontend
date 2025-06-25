// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600">403</h1>
                <p className="text-xl mt-4">Acesso Negado</p>
                <p className="mt-2">Você não tem permissão para acessar esta página.</p>
            </div>
        </div>
    );
}