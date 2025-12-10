"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/store/authStore";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { Shield, Database, Cpu, DollarSign, Bot, Plus, Trash2, Edit2 } from "lucide-react";
import { systemAPI, aiModelsAPI } from "@/lib/api";
import { Spinner } from "@/components/common/Spinner";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { toast } from "@/store/toastStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePromptTemplateSchema, CreatePromptTemplateRequest, PromptTemplate } from "@/types/system";
import { CreateAIModelSchema, CreateAIModelFormValues, AIModel, Provider } from "@/types/aiModels";

// --- Components ---

const DefaultPrompts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [templates, setTemplates] = useState<PromptTemplate[]>([]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreatePromptTemplateRequest>({
        resolver: zodResolver(CreatePromptTemplateSchema)
    });

    const fetchTemplates = async () => {
        setIsLoading(true);
        try {
            const res = await systemAPI.listTemplates();
            setTemplates(res.templates || []);
        } catch (error) {
            console.error("Failed to fetch templates", error);
            toast.error("Error", "Failed to fetch templates");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const onSubmit = async (data: CreatePromptTemplateRequest) => {
        try {
            await systemAPI.createTemplate(data.title, data.content);
            toast.success("Success", "Template created successfully");
            setIsCreating(false);
            reset();
            await fetchTemplates();
        } catch (error) {
            toast.error("Error", "Failed to create template");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Prompt Templates</h2>
                <button onClick={() => setIsCreating(!isCreating)} className="btn btn-primary btn-sm">
                    <Plus className="w-4 h-4 mr-2" /> New Template
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-200">
                    <div>
                        <Input
                            label="Title"
                            {...register("title")}
                            error={errors.title?.message}
                        />
                    </div>
                    <div>
                        <Textarea
                            label="Content"
                            {...register("content")}
                            error={errors.content?.message}
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsCreating(false)} className="btn btn-ghost btn-sm">Cancel</button>
                        <button type="submit" className="btn btn-primary btn-sm">Save</button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="flex justify-center py-8"><Spinner /></div>
            ) : (
                <div className="grid gap-4">
                    {templates.map((t) => (
                        <div key={t.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                            <h3 className="font-medium text-gray-900">{t.title}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{t.content}</p>
                        </div>
                    ))}
                    {templates.length === 0 && <p className="text-gray-500 text-center py-8">No templates found.</p>}
                </div>
            )}
        </div>
    );
};

const AIProviders = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [models, setModels] = useState<AIModel[]>([]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateAIModelFormValues>({
        resolver: zodResolver(CreateAIModelSchema),
        defaultValues: {
            provider: Provider.OPENAI,
            credits_per_1k: 1,
            supports_text: true,
            supports_vision: false,
            supports_voice: false,
            is_reasoning: false
        }
    });

    const fetchModels = async () => {
        setIsLoading(true);
        try {
            const res = await aiModelsAPI.getAll(localStorage.getItem("boltz_by_alpinesbolt_auth_token") || "");
            setModels(res.ai_models || []);
        } catch (error) {
            console.error("Failed to fetch models", error);
            toast.error("Error", "Failed to fetch models");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    const onSubmit = async (data: CreateAIModelFormValues) => {
        try {
            await aiModelsAPI.create(data, localStorage.getItem("boltz_by_alpinesbolt_auth_token") || "");
            toast.success("Success", "AI Model added successfully");
            setIsCreating(false);
            reset();
            await fetchModels();
        } catch (error) {
            toast.error("Error", "Failed to add AI Model");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await aiModelsAPI.delete(id, localStorage.getItem("boltz_by_alpinesbolt_auth_token") || "");
            toast.success("Success", "Model deleted");
            await fetchModels();
        } catch (error) {
            toast.error("Error", "Failed to delete model");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">AI Models</h2>
                <button onClick={() => setIsCreating(!isCreating)} className="btn btn-primary btn-sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Model
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Name"
                            {...register("name")}
                            error={errors.name?.message}
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Provider</label>
                            <select
                                {...register("provider")}
                                className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {Object.values(Provider).map((p) => (
                                    <option key={p} value={p}>
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.provider && <span className="text-xs text-red-500">{errors.provider.message}</span>}
                        </div>
                        <Input
                            label="Credits per 1k"
                            type="number"
                            {...register("credits_per_1k", { valueAsNumber: true })}
                            error={errors.credits_per_1k?.message}
                        />
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" {...register("supports_vision")} />
                            Vision
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" {...register("supports_voice")} />
                            Voice
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" {...register("is_reasoning")} />
                            Reasoning
                        </label>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsCreating(false)} className="btn btn-ghost btn-sm">Cancel</button>
                        <button type="submit" className="btn btn-primary btn-sm">Save</button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="flex justify-center py-8"><Spinner /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Provider</th>
                                <th className="px-4 py-3">Credits/1k</th>
                                <th className="px-4 py-3">Capabilities</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.map((m) => (
                                <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{m.name}</td>
                                    <td className="px-4 py-3">{m.provider}</td>
                                    <td className="px-4 py-3">{m.credits_per_1k}</td>
                                    <td className="px-4 py-3 flex gap-1">
                                        {m.supports_vision && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Vision</span>}
                                        {m.supports_voice && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Voice</span>}
                                        {m.is_reasoning && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">Reasoning</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const CostSettings = () => <div className="p-6 text-center text-gray-500">Cost & Token settings implementation pending backend support.</div>;
const DefaultAgents = () => <div className="p-6 text-center text-gray-500">Default Agent creation implementation pending backend support.</div>;

export default function SuperadminPage() {
    const user = useCurrentUser();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.email === "ebentim4@gmail.com" || user.role === "superadmin") {
                setIsAuthorized(true);
            } else {
                router.push("/dashboard");
            }
        }
    }, [user, router]);

    if (!user || !isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const tabs = [
        { name: "Prompts & Templates", icon: Database, component: DefaultPrompts },
        { name: "AI Providers", icon: Cpu, component: AIProviders },
        { name: "Cost & Tokens", icon: DollarSign, component: CostSettings },
        { name: "Default Agents", icon: Bot, component: DefaultAgents },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-xl text-red-600">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Superadmin Dashboard</h1>
                        <p className="text-gray-500">Manage system-wide settings and configurations.</p>
                    </div>
                </div>

                <TabGroup>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <TabList className="flex flex-col space-y-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-fit">
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.name}
                                    className={({ selected }) =>
                                        cn(
                                            "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 outline-none",
                                            selected
                                                ? "bg-primary-50 text-primary-700 shadow-sm"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )
                                    }
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.name}
                                </Tab>
                            ))}
                        </TabList>

                        {/* Content Area */}
                        <div className="lg:col-span-3">
                            <TabPanels>
                                {tabs.map((tab, idx) => (
                                    <TabPanel
                                        key={idx}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] outline-none animate-fade-in"
                                    >
                                        <tab.component />
                                    </TabPanel>
                                ))}
                            </TabPanels>
                        </div>
                    </div>
                </TabGroup>
            </div>
        </div>
    );
}
