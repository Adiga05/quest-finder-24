import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDocument, useUpdateDocument, useDeleteDocument } from "@/hooks/useDocuments";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash2, Save, X, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: document, isLoading } = useDocument(id || "");
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const handleEdit = () => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
      setCategory(document.category);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    
    try {
      await updateDocument.mutateAsync({
        id,
        title,
        content,
        category,
      });
      toast.success("Document updated!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update document");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteDocument.mutateAsync(id);
      toast.success("Document deleted");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-4xl px-4 py-8">
          <div className="h-96 rounded-2xl bg-muted animate-pulse" />
        </main>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-4xl px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Document not found</h2>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <Card className="border-border/50 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="gradient-hero p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {isEditing ? (
                <div className="flex-1 space-y-4">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold bg-card/90"
                  />
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    className="bg-card/90"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    {document.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="gradient-primary text-primary-foreground border-0">
                      {document.category}
                    </Badge>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Updated {format(new Date(document.updated_at), "MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={updateDocument.isPending}
                      className="gradient-primary hover:opacity-90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this document?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your document.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6 md:p-8">
            {isEditing ? (
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[400px] resize-y"
                />
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {document.content}
                </p>
              </div>
            )}

            {document.tags && document.tags.length > 0 && !isEditing && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}