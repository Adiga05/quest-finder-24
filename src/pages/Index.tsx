import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { DocumentCard } from "@/components/DocumentCard";
import { useDocuments, useCategories } from "@/hooks/useDocuments";
import { FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "updated" | "created" | "title";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("updated");

  const { data: documents, isLoading } = useDocuments(searchQuery, selectedCategory);
  const { data: categories } = useCategories();

  const sortedDocuments = useMemo(() => {
    if (!documents) return [];
    
    return [...documents].sort((a, b) => {
      switch (sortBy) {
        case "created":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "updated":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  }, [documents, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container relative px-4 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gradient">
              Search Your Documents
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find anything in your notes, articles, and documents instantly
            </p>
          </div>
          
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          {categories && categories.length > 1 && (
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="container px-4 pb-16">
        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {sortedDocuments.length} document{sortedDocuments.length !== 1 ? "s" : ""} found
          </p>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : sortedDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDocuments.map((doc, i) => (
              <div key={doc.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <DocumentCard document={doc} searchQuery={searchQuery} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">No documents yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding your first document to search
            </p>
            <Button asChild className="gradient-primary hover:opacity-90">
              <Link to="/add">
                <Sparkles className="w-4 h-4 mr-2" />
                Add Your First Document
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}