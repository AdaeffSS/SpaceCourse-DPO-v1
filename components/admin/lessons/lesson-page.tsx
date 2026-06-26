"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, FileText, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { SelectFileModal } from "./modals/select-file-modal";

type FileInfo = {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
};

type LessonFileRelation = {
    lessonId: string;
    fileId: string;
    file?: FileInfo;
};

type LessonDetails = {
    id: string;
    title: string;
    content: string;
    files: LessonFileRelation[];
    createdAt: string;
    updatedAt: string;
};

export function LessonPage({ id }: { id: string }) {
    const router = useRouter();
    const [lesson, setLesson] = useState<LessonDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [msg, setMsg] = useState("");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [fileModalOpen, setFileOpen] = useState(false);

    useEffect(() => {
        loadLesson();
    }, [id]);

    async function loadLesson() {
        try {
            setLoading(true);
            const data = await api<LessonDetails>(`/admin/lessons/${id}`);
            setLesson(data);
            setTitle(data.title);
            setContent(data.content || "");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        setMsg("");
        try {
            await api(`/admin/lessons/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ title, content }),
            });
            setMsg("Контент лекции успешно обновлен!");
        } catch (err: any) {
            setMsg(err.message || "Ошибка сохранения");
        } finally {
            setSaving(false);
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        setMsg("");

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const uploaded = await api<FileInfo>("/admin/files", {
                method: "POST",
                body: formData,
            });
            if (uploaded && uploaded.id) {
                await handleAttachFile(uploaded.id);
            }
        } catch (err: any) {
            setMsg(err.message || "Ошибка при загрузке файла");
            setUploading(false);
        }
    }

    async function handleAttachFile(fileId: string) {
        if (!fileId) return;
        try {
            const currentFiles = (lesson?.files || [])
                .map(f => f.fileId)
                .filter(id => typeof id === "string" && id.trim() !== "");
                
            if (currentFiles.includes(fileId)) {
                setFileOpen(false);
                return;
            }

            const updatedFileIds = [...currentFiles, fileId];
            await api(`/admin/lessons/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ fileIds: updatedFileIds }),
            });

            await loadLesson();
            setMsg("Материал успешно прикреплен!");
        } catch (err: any) {
            setMsg(err.message || "Ошибка при привязке файла");
        } finally {
            setUploading(false);
            setFileOpen(false);
        }
    }

    async function handleDeleteFileRelation(fileId: string) {
        if (!confirm("Открепить этот файл от урока?")) return;
        try {
            const filteredFileIds = (lesson?.files || [])
                .map(f => f.fileId)
                .filter(id => typeof id === "string" && id !== fileId && id.trim() !== "");

            await api(`/admin/lessons/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ fileIds: filteredFileIds }),
            });

            await loadLesson();
            setMsg("Файл успешно откреплен.");
        } catch (err: any) {
            setMsg(err.message || "Ошибка открепления");
        }
    }

    if (loading) return <div className="p-8 text-zinc-500">Загрузка контента лекции...</div>;
    if (!lesson) return <div className="p-8 text-zinc-500">Урок не найден</div>;

    return (
        <div className="space-y-8 max-w-5xl">
            <SelectFileModal 
                open={fileModalOpen} 
                onClose={() => setFileOpen(false)} 
                onSelect={handleAttachFile} 
            />

            <div>
                <Button variant="ghost" asChild className="mb-4 h-11 rounded-xl px-3">
                    <Link href="/admin/lessons">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад к урокам
                    </Link>
                </Button>
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Редактор лекции</h1>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-5">
                        <div>
                            <label className="text-sm font-medium text-zinc-900">Тема (Название урока)</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-11 border border-zinc-200 rounded-xl px-4 mt-2 text-sm outline-none focus:border-zinc-900 transition-colors"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-zinc-900">Текстовое содержание / Лекционный материал</label>
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14} className="w-full border border-zinc-200 rounded-xl p-4 mt-2 text-sm outline-none focus:border-zinc-900 transition-colors font-mono"/>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-zinc-950">Прикрепленные материалы</h2>
                        
                        <div className="space-y-2">
                            {lesson.files && lesson.files.length > 0 ? (
                                lesson.files.map((item, idx) => {
                                    const name = item.file?.originalName || `Методический материал #${idx + 1}`;
                                    const itemKey = item.fileId || `file-key-${idx}`;
                                    return (
                                        <div 
                                            key={itemKey} 
                                            className="flex items-center justify-between p-3 border border-zinc-200 rounded-xl bg-zinc-50/50"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <FileText className="h-4 w-4 text-zinc-400 shrink-0" />
                                                <span className="text-xs font-medium truncate text-zinc-900 pr-2">{name}</span>
                                            </div>
                                            <button onClick={() => handleDeleteFileRelation(item.fileId)} className="text-red-500 hover:text-red-700 p-1 shrink-0">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-zinc-400 py-2 leading-relaxed">К этому уроку еще не прикреплено ни одного файла.</p>
                            )}
                        </div>

                        <div className="pt-4 border-t border-zinc-100 space-y-2.5">
                            <Button variant="outline" className="w-full text-xs h-10 rounded-xl" onClick={() => setFileOpen(true)}>
                                Выбрать из существующих
                            </Button>
                            
                            <label className="flex items-center justify-center border border-dashed border-zinc-300 rounded-xl h-10 text-xs font-semibold text-zinc-600 bg-zinc-50/30 hover:bg-zinc-50 cursor-pointer transition-colors">
                                <span>{uploading ? "Загрузка..." : "Загрузить новый файл"}</span>
                                <input type="file" onChange={handleUpload} disabled={uploading} className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {msg && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm border border-emerald-200 max-w-3xl shadow-sm">{msg}</div>}

            <div className="flex justify-end gap-3 border-t border-zinc-200 pt-5 max-w-3xl">
                <Button onClick={handleSave} disabled={saving} className="rounded-xl h-11 px-6 shadow-sm">
                    <Check className="mr-2 h-4 w-4" />
                    Сохранить изменения
                </Button>
            </div>
        </div>
    );
}
