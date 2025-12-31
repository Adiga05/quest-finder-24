import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export interface Document {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentInput {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

export interface UpdateDocumentInput extends Partial<CreateDocumentInput> {
  id: string;
}

export function useDocuments(searchQuery?: string, category?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["documents", searchQuery, category],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (category && category !== "All") {
        query = query.eq("category", category);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Document[];
    },
    enabled: !!user,
  });
}

export function useDocument(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Document | null;
    },
    enabled: !!user && !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateDocumentInput) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("documents")
        .insert({
          ...input,
          user_id: user.id,
          tags: input.tags || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateDocumentInput) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("documents")
        .update(input)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Document;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document", data.id] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useCategories() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!user) return ["All", "General"];

      const { data, error } = await supabase
        .from("documents")
        .select("category")
        .eq("user_id", user.id);

      if (error) throw error;

      const categories = new Set(data?.map((d) => d.category) || []);
      return ["All", ...Array.from(categories)];
    },
    enabled: !!user,
  });
}