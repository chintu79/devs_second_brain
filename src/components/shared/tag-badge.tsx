import { Badge } from "@/components/ui/badge";

interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
}

export function TagBadge({ tag, onClick }: TagBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={`cursor-pointer ${onClick ? "hover:bg-secondary/80" : ""}`}
      onClick={onClick}
    >
      {tag}
    </Badge>
  );
}
