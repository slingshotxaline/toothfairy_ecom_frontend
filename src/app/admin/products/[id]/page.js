"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  useAdminGetQuery,
  useAdminSaveMutation,
  useUploadMutation,
} from "@/lib/api";
import { ImageInput, PageTitle } from "@/components/admin/ui";
import { toast } from "@/lib/slices";
import { errMsg } from "@/lib/fmt";

const BLANK = {
  title: "",
  slug: "",
  description: "",
  brandId: "",
  categoryId: "",
  ageGroup: "toddlers",
  style: "girl",
  basePrice: "",
  salePrice: "",
  saleStartsAt: "",
  saleEndsAt: "",
  baseImage: "",
  images: [],
  customFields: [],
  trackStock: true,
  stock: 0,
  featured: false,
  status: "ACTIVE",
  variants: [],
};
const day = (v) => (v ? String(v).slice(0, 10) : "");

export default function ProductForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const router = useRouter();
  const d = useDispatch();
  const { data: cats = [] } = useAdminGetQuery("categories");
  const { data: brands = [] } = useAdminGetQuery("brands");
  const { data: existing } = useAdminGetQuery(`products/${id}`, {
    skip: isNew,
  });
  const [save, { isLoading }] = useAdminSaveMutation();
  const [upload, up] = useUploadMutation();
  const [f, setF] = useState(BLANK);
  useEffect(() => {
    if (existing)
      setF({
        ...BLANK,
        ...existing,
        brandId: existing.brandId || "",
        salePrice: existing.salePrice ?? "",
        saleStartsAt: day(existing.saleStartsAt),
        saleEndsAt: day(existing.saleEndsAt),
        description: existing.description || "",
      });
  }, [existing]);
  useEffect(() => {
    if (isNew && cats.length && !f.categoryId)
      setF((p) => ({ ...p, categoryId: cats[0].id }));
  }, [cats, isNew]); // eslint-disable-line

  const set = (k) => (e) =>
    setF((p) => ({
      ...p,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  const list = (key, i, patch) =>
    setF((p) => ({
      ...p,
      [key]: p[key].map((x, j) => (j === i ? { ...x, ...patch } : x)),
    }));
  const addMore = async (e) => {
    for (const file of e.target.files)
      try {
        const { url } = await upload(file).unwrap();
        setF((p) => ({ ...p, images: [...p.images, url] }));
      } catch (x) {
        d(toast(errMsg(x)));
      }
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      await save({
        path: isNew ? "products" : `products/${id}`,
        method: isNew ? "POST" : "PUT",
        body: f,
      }).unwrap();
      d(toast("Product saved."));
      router.push("/admin/products");
    } catch (x) {
      d(toast(errMsg(x)));
    }
  };

  return (
    <form onSubmit={submit} className="container mx-auto gap-6">
      <PageTitle
        action={
          <button className="btn" disabled={isLoading}>
            {isLoading ? "Saving…" : "Save product"}
          </button>
        }
      >
        {isNew ? "New product" : "Edit product"}
      </PageTitle>
      <section className="panel grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="t">
            Title
          </label>
          <input
            id="t"
            required
            className="input"
            value={f.title}
            onChange={set("title")}
          />
        </div>
        <div>
          <label className="label" htmlFor="s">
            Slug (auto if empty)
          </label>
          <input
            id="s"
            className="input"
            value={f.slug}
            onChange={set("slug")}
          />
        </div>
        <div>
          <label className="label" htmlFor="b">
            Brand
          </label>
          <select
            id="b"
            className="input"
            value={f.brandId}
            onChange={set("brandId")}
          >
            <option value="">No brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="c">
            Category
          </label>
          <select
            id="c"
            required
            className="input"
            value={f.categoryId}
            onChange={set("categoryId")}
          >
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="a">
            Age group (filter key)
          </label>
          <select
            id="a"
            className="input"
            value={f.ageGroup}
            onChange={set("ageGroup")}
          >
            {["newborn", "toddlers", "kids", "teenagers"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="y">
            Style
          </label>
          <select
            id="y"
            className="input"
            value={f.style}
            onChange={set("style")}
          >
            {["girl", "boy", "twinning"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="d">
            Description
          </label>
          <textarea
            id="d"
            rows={4}
            className="input"
            value={f.description}
            onChange={set("description")}
          />
        </div>
        <div>
          <label className="label" htmlFor="st">
            Status
          </label>
          <select
            id="st"
            className="input"
            value={f.status}
            onChange={set("status")}
          >
            {["ACTIVE", "DRAFT", "ARCHIVED"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={f.featured}
            onChange={set("featured")}
          />
          Featured
        </label>
      </section>

      <section className="panel grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <h2 className="eyebrow sm:col-span-2 lg:col-span-4">Pricing</h2>
        <div>
          <label className="label" htmlFor="bp">
            Base price ৳
          </label>
          <input
            id="bp"
            required
            type="number"
            step="any"
            className="input"
            value={f.basePrice}
            onChange={set("basePrice")}
          />
        </div>
        <div>
          <label className="label" htmlFor="sp">
            Sale price ৳
          </label>
          <input
            id="sp"
            type="number"
            step="any"
            className="input"
            value={f.salePrice}
            onChange={set("salePrice")}
          />
        </div>
        <div>
          <label className="label" htmlFor="ss">
            Sale starts
          </label>
          <input
            id="ss"
            type="date"
            className="input"
            value={f.saleStartsAt}
            onChange={set("saleStartsAt")}
          />
        </div>
        <div>
          <label className="label" htmlFor="se">
            Sale ends
          </label>
          <input
            id="se"
            type="date"
            className="input"
            value={f.saleEndsAt}
            onChange={set("saleEndsAt")}
          />
        </div>
      </section>

      <section className="panel grid gap-5">
        <h2 className="eyebrow">Images</h2>
        <ImageInput
          label="Base image"
          value={f.baseImage}
          onChange={(v) => setF({ ...f, baseImage: v })}
        />
        <div>
          <span className="label">Additional images</span>
          <div className="flex flex-wrap items-center gap-3">
            {f.images.map((u, i) => (
              <div key={u} className="relative">
                <img
                  src={u}
                  alt=""
                  className="h-20 w-16 border border-line object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-fg text-xs text-bg"
                  onClick={() =>
                    setF({ ...f, images: f.images.filter((_, j) => j !== i) })
                  }
                >
                  ×
                </button>
              </div>
            ))}
            <label className="btn-ghost cursor-pointer">
              {up.isLoading ? "Uploading…" : "Add images"}
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={addMore}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="panel grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="eyebrow">Inventory and variants</h2>
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              setF({
                ...f,
                variants: [
                  ...f.variants,
                  { size: "", color: "", sku: "", price: "", stock: 0 },
                ],
              })
            }
          >
            Add variant
          </button>
        </div>
        {f.variants.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={f.trackStock}
                onChange={set("trackStock")}
              />
              Track stock
            </label>
            {f.trackStock && (
              <div>
                <label className="label" htmlFor="stk">
                  Stock
                </label>
                <input
                  id="stk"
                  type="number"
                  className="input"
                  value={f.stock}
                  onChange={set("stock")}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-2">
            <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_80px_30px] gap-2 text-[10px] uppercase tracking-wider2 text-muted sm:grid">
              <span>Size</span>
              <span>Colour</span>
              <span>SKU</span>
              <span>Price override</span>
              <span>Stock</span>
              <span />
            </div>
            {f.variants.map((v, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_1fr_80px_30px]"
              >
                {["size", "color", "sku", "price"].map((k) => (
                  <input
                    key={k}
                    aria-label={k}
                    placeholder={k}
                    className="input"
                    value={v[k] ?? ""}
                    onChange={(e) =>
                      list("variants", i, { [k]: e.target.value })
                    }
                  />
                ))}
                <input
                  aria-label="stock"
                  type="number"
                  className="input"
                  value={v.stock}
                  onChange={(e) =>
                    list("variants", i, { stock: e.target.value })
                  }
                />
                <button
                  type="button"
                  aria-label="Remove variant"
                  onClick={() =>
                    setF({
                      ...f,
                      variants: f.variants.filter((_, j) => j !== i),
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="eyebrow">Custom fields (shown on the product page)</h2>
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              setF({
                ...f,
                customFields: [...f.customFields, { key: "", value: "" }],
              })
            }
          >
            Add field
          </button>
        </div>
        {f.customFields.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_30px] gap-2">
            <input
              aria-label="Field name"
              placeholder="e.g. Fabric"
              className="input"
              value={c.key}
              onChange={(e) => list("customFields", i, { key: e.target.value })}
            />
            <input
              aria-label="Field value"
              placeholder="e.g. Soft cotton"
              className="input"
              value={c.value}
              onChange={(e) =>
                list("customFields", i, { value: e.target.value })
              }
            />
            <button
              type="button"
              aria-label="Remove field"
              onClick={() =>
                setF({
                  ...f,
                  customFields: f.customFields.filter((_, j) => j !== i),
                })
              }
            >
              ×
            </button>
          </div>
        ))}
      </section>
    </form>
  );
}
