import { useState } from "react";
import { Plus, X } from "lucide-react";
import TextEditor from "./TextEditor";

interface QAItem {
  id: string;
  title: string;
  questions: string[];
  answer: string;
}

interface QATrainerProps {
  onSubmit?: (data: QAItem) => void;
}

export function QATrainer({ onSubmit }: QATrainerProps) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([""]); 
  const [answer, setAnswer] = useState("");
  const [savedQAs, setSavedQAs] = useState<QAItem[]>([]);

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const handleSubmit = () => {
    if (!title.trim() || !answer.trim() || questions.every(q => !q.trim())) {
      return;
    }

    const qaItem: QAItem = {
      id: Date.now().toString(),
      title: title.trim(),
      questions: questions.filter(q => q.trim()),
      answer: answer.trim(),
    };

    setSavedQAs([...savedQAs, qaItem]);
    onSubmit?.(qaItem);

    // Reset form
    setTitle("");
    setQuestions([""]);
    setAnswer("");
  };

  const removeQA = (id: string) => {
    setSavedQAs(savedQAs.filter(qa => qa.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border border-gray-300 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-4">Add Q&A</h3>
        <p className="text-sm text-gray-500 mb-4">
          Create question-answer pairs to train your agent with specific responses.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Refund Policy Questions"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
            {questions.map((question, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder="Enter a question..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addQuestion}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="w-4 h-4" />
              Add another question
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="Enter the answer for these questions..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !answer.trim() || questions.every(q => !q.trim())}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Q&A
            </button>
          </div>
        </div>
      </div>

      {/* Saved Q&As */}
      {savedQAs.length > 0 && (
        <div className="border border-gray-300 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-4">Saved Q&As ({savedQAs.length})</h4>
          <div className="space-y-3">
            {savedQAs.map((qa) => (
              <div key={qa.id} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{qa.title}</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      {qa.questions.length} question{qa.questions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => removeQA(qa.id)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}