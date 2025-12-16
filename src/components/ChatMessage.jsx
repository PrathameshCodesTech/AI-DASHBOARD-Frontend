import React from 'react';
import { Bot, User, Check, AlertCircle } from 'lucide-react';
import ChartRenderer from './ChartRenderer';

const ChatMessage = ({ message, isUser = false }) => {
  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-end mb-6">
        <div className="chat-bubble-user">
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center animate-pulse-slow">
        <Bot className="w-5 h-5 text-white" />
      </div>
      
      <div className="flex-1 max-w-3xl">
        <div className="chat-bubble-ai">
          {/* Success/Error indicator */}
          {message.success !== undefined && (
            <div className={`flex items-center gap-2 mb-3 pb-3 border-b ${message.success ? 'border-green-800' : 'border-red-800'}`}>
              {message.success ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-green-400">Success</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-medium text-red-400">Error</span>
                </>
              )}
            </div>
          )}
          
          {/* Message text */}
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          </div>
          
          {/* Operation badge */}
          {message.operation && (
            <div className="mt-3 pt-3 border-t border-dark-700">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400 border border-primary-500/30">
                {message.operation.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {/* Chart */}
        {message.chartConfig && (
          <div className="mt-4 card">
            <ChartRenderer chartConfig={message.chartConfig} />
          </div>
        )}
        
        {/* Data display - for created/updated records */}
        {message.data && !message.chartConfig && (
          <div className="mt-4 card">
            <DataDisplay data={message.data} />
          </div>
        )}
      </div>
    </div>
  );
};

// Component to display data in a nice format
const DataDisplay = ({ data }) => {
  if (Array.isArray(data)) {
    return (
      <div className="space-y-2">
        {data.map((item, idx) => (
          <DataItem key={idx} data={item} />
        ))}
      </div>
    );
  }

  return <DataItem data={data} />;
};

const DataItem = ({ data }) => {
  if (typeof data !== 'object' || data === null) {
    return <div className="text-dark-300 text-sm">{String(data)}</div>;
  }

  // Handle count object
  if ('count' in data && Object.keys(data).length === 1) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl font-bold gradient-text">{data.count}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between py-2 border-b border-dark-800">
          <span className="text-xs font-medium text-dark-400 uppercase tracking-wider">
            {key.replace(/_/g, ' ')}
          </span>
          <span className="text-sm text-dark-200 font-medium">
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatMessage;