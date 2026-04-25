import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft, Upload, X, Loader2 } from "lucide-react";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { CATEGORIES, slugify, BRAND_NAME } from "@/lib/brand";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.enum(["lehenga", "saree", "suit"]),
  price: z.number().positive().max(10000000),
  original_price: z.number().positive().max(10000000).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  fabric: z.string().max(80).optional().nullable(),
  color: z.string().max(60).optional().nullable(),
  reel_url: z.string().url().max(500).optional().nullable().or(z.literal("")),
});

interface ExistingImage { id: string; url: string; position: number; }

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<"lehenga" | "saree" | "suit">("lehenga");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [color, setColor] = useState("");
  const [reelUrl, setReelUrl] = useState("");
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = `${isEdit ? "Edit" : "New"} Product | ${BRAND_NAME}`;
    if (loading) return;
    if (!user || !isAdmin) { navigate("/"); return; }
    if (isEdit && id) {
      supabase.from("products").select("*, product_images(id,url,position)").eq("id", id).maybeSingle()
        .then(({ data }) => {
          if (!data) { toast({ title: "Not found" }); navigate("/admin"); return; }
          const p: any = data;
          setName(p.name); setCategory(p.category); setPrice(String(p.price));
          setOriginalPrice(p.original_price ? String(p.original_price) : "");
          setDescription(p.description ?? ""); setFabric(p.fabric ?? "");
          setColor(p.color ?? ""); setReelUrl(p.reel_url ?? "");
          setInStock(p.in_stock); setFeatured(p.featured);
          setExistingImages((p.product_images ?? []).sort((a: any, b: any) => a.position - b.position));
        });
    }
  }, [id, isEdit, user, isAdmin, loading, navigate]);

  const removeExisting = async (img: ExistingImage) => {
    setExistingImages((s) => s.filter((x) => x.id !== img.id));
    await supabase.from("product_images").delete().eq("id", img.id);
    const path = img.url.split("/product-images/")[1];
    if (path) await supabase.storage.from("product-images").remove([path]);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => f.size <= 5 * 1024 * 1024 && f.type.startsWith("image/"));
    if (valid.length < files.length) toast({ title: "Some files skipped", description: "Images must be under 5MB.", variant: "destructive" });
    setNewFiles((s) => [...s, ...valid].slice(0, 8));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      name, category,
      price: Number(price),
      original_price: originalPrice ? Number(originalPrice) : null,
      description: description || null,
      fabric: fabric || null,
      color: color || null,
      reel_url: reelUrl || null,
    });
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      return toast({ title: "Invalid input", description: `${first.path.join(".")}: ${first.message}`, variant: "destructive" });
    }

    setSubmitting(true);
    try {
      let productId = id;
      const slug = `${slugify(name)}-${Date.now().toString(36).slice(-5)}`;
      const payload = {
        name: parsed.data.name,
        category: parsed.data.category,
        price: parsed.data.price,
        original_price: parsed.data.original_price,
        description: parsed.data.description,
        fabric: parsed.data.fabric,
        color: parsed.data.color,
        reel_url: parsed.data.reel_url || null,
        in_stock: inStock,
        featured,
      };

      if (isEdit && productId) {
        const { error } = await supabase.from("products").update(payload).eq("id", productId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("products").insert({ ...payload, slug }).select("id").single();
        if (error) throw error;
        productId = data.id;
      }

      // Upload new images
      if (productId && newFiles.length) {
        const startPos = existingImages.length;
        for (let i = 0; i < newFiles.length; i++) {
          const file = newFiles[i];
          const ext = file.name.split(".").pop() ?? "jpg";
          const path = `${productId}/${Date.now()}-${i}.${ext}`;
          const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type });
          if (upErr) throw upErr;
          const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
          await supabase.from("product_images").insert({ product_id: productId, url: pub.publicUrl, position: startPos + i });
        }
      }

      toast({ title: isEdit ? "Product updated" : "Product added!" });
      navigate("/admin");
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ChevronLeft size={16} /> Back to admin
        </Link>
        <h1 className="font-serif text-4xl text-primary mb-8">{isEdit ? "Edit Product" : "Add New Product"}</h1>

        <form onSubmit={submit} className="space-y-6">
          <Card className="p-6 space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} placeholder="e.g. Maroon Velvet Bridal Lehenga" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cat">Category *</Label>
                <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                  <SelectTrigger id="cat"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input id="price" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="12999" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="op">Original Price (₹) <span className="text-muted-foreground text-xs">(optional, for showing discount)</span></Label>
                <Input id="op" type="number" min="0" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="18999" />
              </div>
              <div>
                <Label htmlFor="color">Colour</Label>
                <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} maxLength={60} placeholder="Maroon & Gold" />
              </div>
            </div>

            <div>
              <Label htmlFor="fabric">Fabric</Label>
              <Input id="fabric" value={fabric} onChange={(e) => setFabric(e.target.value)} maxLength={80} placeholder="Velvet with Zardozi work" />
            </div>

            <div>
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={2000} placeholder="Describe the piece, craftsmanship, occasion..." />
            </div>

            <div>
              <Label htmlFor="reel">Reel / Video URL <span className="text-muted-foreground text-xs">(YouTube or Instagram)</span></Label>
              <Input id="reel" value={reelUrl} onChange={(e) => setReelUrl(e.target.value)} maxLength={500} placeholder="https://youtube.com/shorts/... or https://instagram.com/reel/..." />
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer"><Switch checked={inStock} onCheckedChange={setInStock} /> <span className="text-sm">In Stock</span></label>
              <label className="flex items-center gap-3 cursor-pointer"><Switch checked={featured} onCheckedChange={setFeatured} /> <span className="text-sm">Featured on homepage</span></label>
            </div>
          </Card>

          <Card className="p-6">
            <Label className="mb-3 block">Product Images <span className="text-muted-foreground text-xs">(up to 8, max 5MB each)</span></Label>

            {existingImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative aspect-square bg-muted overflow-hidden group">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExisting(img)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}

            {newFiles.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {newFiles.map((f, i) => (
                  <div key={i} className="relative aspect-square bg-muted overflow-hidden group">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setNewFiles((s) => s.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}

            <label className="border-2 border-dashed border-border rounded p-8 text-center cursor-pointer hover:border-primary transition-smooth block">
              <Upload className="mx-auto mb-2 text-gold-deep" size={28} />
              <p className="text-sm font-medium">Click to upload images</p>
              <p className="text-xs text-muted-foreground mt-1">PNG / JPG up to 5MB</p>
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            </label>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" asChild><Link to="/admin">Cancel</Link></Button>
            <Button type="submit" variant="gold" size="lg" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 animate-spin" size={16} />}
              {isEdit ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </section>
    </Layout>
  );
}
