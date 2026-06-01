import { Card } from "@/components/ui/Card";

export function EmptyState({ message = "Nothing here yet." }: { message?: string }) {
  return (
    <Card>
      <p className="text-sm text-slate-400">{message}</p>
    </Card>
  );
}
