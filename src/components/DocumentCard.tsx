import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag } from "lucide-react";
import { Document } from "@/hooks/useDocuments";
import { format } from "date-fns";

interface DocumentCardProps {
  document: Document;
  searchQuery?: string;
}

function highlightText(text: string, query: string) {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-accent/30 text-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function DocumentCard({ document, searchQuery }: DocumentCardProps) {
  const snippet = document.content.slice(0, 150) + (document.content.length > 150 ? "..." : "");

  return (
    <Link to={`/document/${document.id}`}>
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 hover:border-primary/30 gradient-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {highlightText(document.title, searchQuery || "")}
            </h3>
            <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary border-0">
              {document.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {highlightText(snippet, searchQuery || "")}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(document.updated_at), "MMM d, yyyy")}</span>
            </div>
            
            {document.tags && document.tags.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>{document.tags.length} tags</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}