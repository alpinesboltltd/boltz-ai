"use client";

import { useState } from "react";
import { Spinner } from "@/components/common/Spinner";

interface WordPressIntegrationModalProps {
  chatagentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WordPressIntegrationModal({
  chatagentId,
  isOpen,
  onClose,
  onSuccess,
}: WordPressIntegrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleDownloadPlugin = () => {
    // In production, this would download the WordPress plugin
    // window.location.href = `/api/integrations/wordpress/download-plugin?chatagentId=${chatagentId}`;

    // For development, show a message
    alert("In production, this would download the WordPress plugin.");
    setStep(2);
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      // In production, this would call the real API
      // await fetch(`/api/chatagents/${chatagentId}/integrations/wordpress/verify`, {
      //   method: 'POST',
      // });

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to verify WordPress integration:", err);
      setError(
        "Failed to verify WordPress integration. Please make sure the plugin is installed correctly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Connect WordPress
        </h3>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {step === 1 ? (
          <div>
            <p className="text-sm text-gray-500 mb-6">
              Connect your chatagent to your WordPress site by installing our
              plugin.
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-blue-800">
                  Installation Steps
                </h4>
                <ol className="mt-2 text-xs text-blue-700 list-decimal list-inside space-y-1">
                  <li>Download the Boltz WordPress plugin</li>
                  <li>Log in to your WordPress admin panel</li>
                  <li>Go to Plugins &gt; Add New &gt; Upload Plugin</li>
                  <li>
                    Upload the downloaded ZIP file and activate the plugin
                  </li>
                  <li>
                    Go to Boltz settings in WordPress and enter your chatagent
                    ID:{" "}
                    <span className="font-mono bg-blue-100 px-1 rounded">
                      {chatagentId}
                    </span>
                  </li>
                </ol>
              </div>

              <button
                type="button"
                onClick={handleDownloadPlugin}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download WordPress Plugin
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-6">
              Have you installed and activated the plugin on your WordPress
              site?
            </p>

            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-green-800">
                  Verification
                </h4>
                <p className="mt-2 text-xs text-green-700">
                  Click the button below to verify that the plugin is installed
                  correctly and connected to your chatagent.
                </p>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <>
                    <svg
                      className="h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verify Connection
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
