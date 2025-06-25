// components/ExampleComponent.tsx
'use client'
import { ProtectedComponent } from '@/components/ProtectedComponent'
import { usePermissions } from '@/hooks/usePermissions'
import { Button } from '@/components/ui/button'

export function ExampleComponent() {
  const { isAdmin, canEditContent, canDeleteContent, user } = usePermissions()

  return (
    <div className="p-4">
      <h1>Exemplo de Componente</h1>
      
      {/* Só aparece para usuários logados */}
      <ProtectedComponent>
        <p>Você está logado como: {user?.name}</p>
      </ProtectedComponent>
      
      {/* Só aparece para ADMINs */}
      <ProtectedComponent roles={['ADMIN']}>
        <Button variant="destructive">
          Botão Perigoso (Só Admin)
        </Button>
      </ProtectedComponent>

      {/* Aparece para ADMIN ou MODERATOR */}
      <ProtectedComponent 
        roles={['ADMIN', 'MODERATOR']}
        fallback={<p>Você não tem permissão para ver esta seção</p>}
      >
        <div className="border p-4 mt-4">
          <h2>Área de Moderação</h2>
          <p>Conteúdo para admin ou moderador</p>
        </div>
      </ProtectedComponent>

      {/* Verificação inline usando hooks */}
      {canEditContent() && (
        <Button>Editar Conteúdo</Button>
      )}

      {isAdmin() && (
        <Button variant="outline">
          Configurações Avançadas
        </Button>
      )}
    </div>
  )
}