import { ExampleComponent } from "@/components/Pages/private/ExampleComponent";

export default function PrivatePage() {
    return (
      <div>
        <p>
          Página exclusiva para Admins
        </p>
        <ExampleComponent />
      </div>
    );
}
