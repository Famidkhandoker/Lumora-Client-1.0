import { useEffect, useState } from "react";
import axiosInstance from "../../../utilits/axiosInstance";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiEdit2, FiGift } from "react-icons/fi";

const EMPTY = {
  title: "",
  message: "",
  imageUrl: "",
  ctaText: "Learn more",
  ctaLink: "",
  active: true,
  startDate: "",
  endDate: "",
};

const ManagePromotions = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/promotions");
      setList(data);
    } catch (err) {
      toast.error("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    try {
      if (editingId) {
        await axiosInstance.put(`/api/promotions/${editingId}`, form);
        toast.success("Promotion updated");
      } else {
        await axiosInstance.post("/api/promotions", form);
        toast.success("Promotion created");
      }
      setForm(EMPTY);
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    }
  };

  const edit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title || "",
      message: p.message || "",
      imageUrl: p.imageUrl || "",
      ctaText: p.ctaText || "Learn more",
      ctaLink: p.ctaLink || "",
      active: !!p.active,
      startDate: p.startDate ? p.startDate.slice(0, 10) : "",
      endDate: p.endDate ? p.endDate.slice(0, 10) : "",
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this promotion?")) return;
    try {
      await axiosInstance.delete(`/api/promotions/${id}`);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-[var(--lum-skysoft)] px-4 py-2.5 text-[var(--lum-text)] outline-none focus:border-[var(--lum-accent)]";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--lum-text)]">
          Special Offers & Events
        </h2>
        <p className="mt-1 text-sm text-[var(--lum-text)]/60">
          Add a promotion and it will automatically open as a popup for every
          visitor (once per session) until you deactivate it.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={submit}
        className="rounded-2xl border border-[var(--lum-skysoft)] bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-[var(--lum-text)]/70">
              Title
            </label>
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Summer Wedding Expo 2026"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-[var(--lum-text)]/70">
              Message
            </label>
            <textarea
              className={inputCls + " min-h-[80px]"}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Get 20% off your first booking..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-[var(--lum-text)]/70">
              Image URL (optional)
            </label>
            <input
              className={inputCls}
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://.../banner.jpg"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--lum-text)]/70">
              Button Text
            </label>
            <input
              className={inputCls}
              value={form.ctaText}
              onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--lum-text)]/70">
              Button Link (optional)
            </label>
            <input
              className={inputCls}
              value={form.ctaLink}
              onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--lum-text)]/70">
              Start Date (optional)
            </label>
            <input
              type="date"
              className={inputCls}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--lum-text)]/70">
              End Date (optional)
            </label>
            <input
              type="date"
              className={inputCls}
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="h-4 w-4 accent-[var(--lum-accent)]"
            />
            <label htmlFor="active" className="text-sm text-[var(--lum-text)]/80">
              Active (show to visitors)
            </label>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--lum-accent)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <FiPlus /> {editingId ? "Update Promotion" : "Create Promotion"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY);
              }}
              className="rounded-xl border border-[var(--lum-skysoft)] px-6 py-3 font-semibold text-[var(--lum-text)]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="mt-8">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-[var(--lum-text)]">
          <FiGift /> Active & Past Promotions
        </h3>
        {loading ? (
          <p className="text-sm text-[var(--lum-text)]/50">Loading...</p>
        ) : list.length === 0 ? (
          <p className="text-sm text-[var(--lum-text)]/50">No promotions yet.</p>
        ) : (
          <div className="space-y-3">
            {list.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between gap-4 rounded-xl border border-[var(--lum-skysoft)] bg-white p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-[var(--lum-text)]">
                      {p.title}
                    </p>
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs font-semibold " +
                        (p.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500")
                      }
                    >
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {p.message && (
                    <p className="truncate text-sm text-[var(--lum-text)]/60">
                      {p.message}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => edit(p)}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--lum-skysoft)] text-[var(--lum-text)] transition hover:bg-[var(--lum-peach)]"
                    aria-label="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => remove(p._id)}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePromotions;
