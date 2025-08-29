import { useState } from 'react';
import { ThumbsUp, Flag, MessageSquare, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

type FeedbackType = 'positive' | 'correction' | 'unclear_response' | 'incomplete_information' | 'irrelevant_response' | 'tone_inappropriate' | 'other';

interface FeedbackButtonsProps {
  messageId: string;
  onFeedback: (messageId: string, type: FeedbackType, comment?: string) => void;
  onImprove?: (messageId: string, improvedText: string, reason: string) => void;
}

const feedbackOptions = [
  { type: 'positive' as FeedbackType, label: 'Helpful', icon: ThumbsUp, description: 'This response was accurate and helpful' },
  { type: 'correction' as FeedbackType, label: 'Wrong Info', icon: Flag, description: 'The AI provided incorrect information' },
  { type: 'unclear_response' as FeedbackType, label: 'Unclear', icon: MessageSquare, description: 'The response was hard to understand' },
  { type: 'incomplete_information' as FeedbackType, label: 'Incomplete', icon: MessageSquare, description: 'The response only partially answered the question' },
  { type: 'irrelevant_response' as FeedbackType, label: 'Off-topic', icon: Flag, description: 'The response was completely irrelevant' },
  { type: 'tone_inappropriate' as FeedbackType, label: 'Wrong Tone', icon: MessageSquare, description: 'The tone was inappropriate for the context' },
  { type: 'other' as FeedbackType, label: 'Other', icon: Flag, description: 'Other feedback not covered above' }
];

export default function FeedbackButtons({ messageId, onFeedback, onImprove }: FeedbackButtonsProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showImproveBox, setShowImproveBox] = useState(false);
  const [improvedText, setImprovedText] = useState('');
  const [improveReason, setImproveReason] = useState('');

  const handleFeedback = (type: FeedbackType) => {
    setSelectedType(type);
    if (type === 'positive') {
      onFeedback(messageId, type);
      setShowOptions(false);
    } else {
      setShowCommentBox(true);
    }
  };

  const submitFeedback = () => {
    if (selectedType) {
      onFeedback(messageId, selectedType, comment);
      setShowOptions(false);
      setShowCommentBox(false);
      setComment('');
    }
  };

  const submitImprovement = () => {
    if (onImprove && improvedText && improveReason) {
      onImprove(messageId, improvedText, improveReason);
      setShowOptions(false);
      setShowImproveBox(false);
      setImprovedText('');
      setImproveReason('');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        title="Provide feedback on this response"
      >
        Feedback
      </button>
      {onImprove && (
        <button
          onClick={() => setShowImproveBox(!showImproveBox)}
          className="text-xs px-2 py-1 border border-blue-300 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
          title="Improve this response"
        >
          <Edit className="w-3 h-3 inline mr-1" />
          Improve
        </button>
      )}
      <div className="relative">
      
      {showOptions && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-64 z-10">
          <div className="space-y-2">
            {feedbackOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.type}
                  onClick={() => handleFeedback(option.type)}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 text-left rounded hover:bg-gray-50 transition-colors",
                    option.type === 'positive' ? 'text-green-600 hover:bg-green-50' : 'text-gray-700'
                  )}
                  title={option.description}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{option.label}</span>
                </button>
              );
            })}
          </div>
          
          {showCommentBox && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Please provide more details..."
                className="w-full p-2 text-sm border border-gray-300 rounded resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={submitFeedback}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setShowCommentBox(false);
                    setComment('');
                    setSelectedType(null);
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setShowOptions(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}
      
      {showImproveBox && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-80 z-10">
          <h4 className="font-medium text-sm mb-3">Improve Response</h4>
          <textarea
            value={improvedText}
            onChange={(e) => setImprovedText(e.target.value)}
            placeholder="Write an improved version of this response..."
            className="w-full p-2 text-sm border border-gray-300 rounded resize-none mb-3"
            rows={4}
          />
          <textarea
            value={improveReason}
            onChange={(e) => setImproveReason(e.target.value)}
            placeholder="Explain why this improvement is better..."
            className="w-full p-2 text-sm border border-gray-300 rounded resize-none mb-3"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={submitImprovement}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              disabled={!improvedText || !improveReason}
            >
              Submit
            </button>
            <button
              onClick={() => {
                setShowImproveBox(false);
                setImprovedText('');
                setImproveReason('');
              }}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
          <button
            onClick={() => setShowImproveBox(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}
      </div>
    </div>
  );
}