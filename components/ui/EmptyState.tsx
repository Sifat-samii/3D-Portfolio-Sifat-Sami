import { Card } from "@/components/ui/Card";

export function EmptyState({ message = "Nothing here yet." }: { message?: string }) {
  return (
    <Card className="border-dashed">
      <p className="text-center text-sm leading-6 text-slate-400">{message}</p>
    </Card>
  );
}
