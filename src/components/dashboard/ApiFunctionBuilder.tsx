import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  apiFunctionSchema,
  ApiFunctionFormData,
} from "@/schemas/actionSchemas";
import {
  X,
  Save,
  Globe,
  Lock,
  Code,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useState } from "react";

interface ApiFunctionBuilderProps {
  onSave: (apiFunction: ApiFunctionFormData) => void;
  onCancel: () => void;
  initialFunction?: Partial<ApiFunctionFormData>;
}

export function ApiFunctionBuilder({
  onSave,
  onCancel,
  initialFunction,
}: ApiFunctionBuilderProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ApiFunctionFormData>({
    resolver: zodResolver(apiFunctionSchema),
    defaultValues: {
      name: initialFunction?.name || "",
      description: initialFunction?.description || "",
      method: initialFunction?.method || "GET",
      url: initialFunction?.url || "",
      authType: initialFunction?.authType || "none",
      ...initialFunction,
    },
  });

  const [toggles, setToggles] = useState({
    headers: false,
    queryParams: false,
    requestBody: false,
    responseMapping: false,
  });

  const watchedAuthType = watch("authType");
  const watchedMethod = watch("method");

  const ToggleButton = ({
    isJson,
    onToggle,
  }: {
    isJson: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
        isJson ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {isJson ? (
        <ToggleRight className="w-4 h-4" />
      ) : (
        <ToggleLeft className="w-4 h-4" />
      )}
      {isJson ? "JSON" : "Form"}
    </button>
  );

  const onSubmit = (data: ApiFunctionFormData) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Code className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold">Create API Function</h2>
          </div>
          <div className="flex items-center gap-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Save className="w-4 h-4" />
                Save Function
              </button>
            </form>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form
            id="api-function-form"
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Function Name *
                </label>
                <input
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Get Customer Info"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  {...register("description")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="What does this function do?"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* API Configuration */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                API Configuration
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Method *
                  </label>
                  <select
                    {...register("method")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL *
                  </label>
                  <input
                    {...register("url")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://api.example.com/endpoint"
                  />
                  {errors.url && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.url.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Headers
                    </label>
                    <ToggleButton
                      isJson={toggles.headers}
                      onToggle={() =>
                        setToggles((prev) => ({
                          ...prev,
                          headers: !prev.headers,
                        }))
                      }
                    />
                  </div>
                  {toggles.headers ? (
                    <textarea
                      {...register("headers")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder='{"Content-Type": "application/json", "Authorization": "Bearer {{token}}"}'
                    />
                  ) : (
                    <div className="space-y-2">
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Content-Type: application/json"
                        onChange={(e) => {
                          const headers = e.target.value
                            .split("\n")
                            .reduce((acc: any, line) => {
                              const [key, value] = line
                                .split(":")
                                .map((s) => s.trim());
                              if (key && value) acc[key] = value;
                              return acc;
                            }, {});
                          setValue("headers", headers);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Query Parameters
                    </label>
                    <ToggleButton
                      isJson={toggles.queryParams}
                      onToggle={() =>
                        setToggles((prev) => ({
                          ...prev,
                          queryParams: !prev.queryParams,
                        }))
                      }
                    />
                  </div>
                  {toggles.queryParams ? (
                    <textarea
                      {...register("queryParams")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder='{"limit": "10", "page": "1", "filter": "{{status}}"}'
                    />
                  ) : (
                    <div className="space-y-2">
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="limit=10&page=1"
                        onChange={(e) => {
                          const params = new URLSearchParams(e.target.value);
                          const queryParams: any = {};
                          params.forEach((value, key) => {
                            queryParams[key] = value;
                          });
                          setValue("queryParams", queryParams);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {(watchedMethod === "POST" ||
                watchedMethod === "PUT" ||
                watchedMethod === "PATCH") && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Request Body
                    </label>
                    <ToggleButton
                      isJson={toggles.requestBody}
                      onToggle={() =>
                        setToggles((prev) => ({
                          ...prev,
                          requestBody: !prev.requestBody,
                        }))
                      }
                    />
                  </div>
                  {toggles.requestBody ? (
                    <textarea
                      {...register("requestBody")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={4}
                      placeholder='{"name": "{{customer_name}}", "email": "{{customer_email}}", "status": "active"}'
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Field name"
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        placeholder="Field value"
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Use {"{{ variable_name }}"} for dynamic values
                  </p>
                </div>
              )}
            </div>

            {/* Authentication */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Authentication
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authentication Type
                </label>
                <select
                  {...register("authType")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="none">None</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                  <option value="api_key">API Key</option>
                  <option value="oauth">OAuth 2.0</option>
                </select>
              </div>

              {watchedAuthType === "bearer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bearer Token
                  </label>
                  <input
                    {...register("bearerToken")}
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter bearer token"
                  />
                </div>
              )}

              {watchedAuthType === "basic" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      {...register("basicUsername")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      {...register("basicPassword")}
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Password"
                    />
                  </div>
                </div>
              )}

              {watchedAuthType === "api_key" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Name
                    </label>
                    <input
                      {...register("apiKeyHeader")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="X-API-Key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      {...register("apiKey")}
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter API key"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Response & Error Handling */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">
                Response & Error Handling
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Response Mapping
                    </label>
                    <ToggleButton
                      isJson={toggles.responseMapping}
                      onToggle={() =>
                        setToggles((prev) => ({
                          ...prev,
                          responseMapping: !prev.responseMapping,
                        }))
                      }
                    />
                  </div>
                  {toggles.responseMapping ? (
                    <textarea
                      {...register("responseMapping")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder='{"customer_id": "data.id", "name": "data.name", "email": "data.email"}'
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          placeholder="Variable name"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          placeholder="Response path"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Map response fields to variables
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fallback Message
                  </label>
                  <textarea
                    {...register("errorHandling.fallbackMessage")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Sorry, I couldn't process your request right now."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retry Attempts
                  </label>
                  <input
                    {...register("errorHandling.retries", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min="0"
                    max="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout (ms)
                  </label>
                  <input
                    {...register("errorHandling.timeout", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min="1000"
                    max="30000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="5000"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="api-function-form"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Create Function
          </button>
        </div>
      </div>
    </div>
  );
}
