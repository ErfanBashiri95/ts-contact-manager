import express from "express";
import cors from "cors";
import { listContacts, addContact, updateContact, removeContact } from "./contacts";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS کامل
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.options("*", cors());

// برای JSON
app.use(express.json());

// سلامت
app.get("/health", (_req, res) => res.json({ ok: true }));

// لیست
app.get("/contacts", async (_req, res) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// ساخت
app.post("/contacts", async (req, res) => {
  try {
    const created = await addContact(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to create contact" });
  }
});

// ویرایش (PUT)
app.put("/contacts/:id", async (req, res) => {
  try {
    const updated = await updateContact(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to update contact" });
  }
});

// ویرایش جزئی (PATCH) – به همان updateContact وصل می‌کنیم
app.patch("/contacts/:id", async (req, res) => {
  try {
    const updated = await updateContact(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to update contact" });
  }
});

// حذف
app.delete("/contacts/:id", async (req, res) => {
  try {
    const removed = await removeContact(req.params.id);
    res.json(removed);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to delete contact" });
  }
});

// روت پیش‌فرض
app.get("/", (_req, res) => {
  res.status(404).json({ error: "Use /health or /contacts" });
});

// اجرا
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
