// components/UrlInputForm.tsx
import React, { useState } from 'react';
import { CircleAlert } from 'lucide-react';

const UrlInputForm: React.FC = () => {
  const [protocol, setProtocol] = useState<string>('https://');
  const [url, setUrl] = useState<string>('');
 

  
  return (
        <>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <select
                    id="protocol-select"
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    className="bg-gray-200 py-2.5 px-2 pr-4 text-gray-700 font-medium border-none outline-none cursor-pointer rounded-l-lg"
                >
                    <option value="https://">https://</option>
                    <option value="http://">http://</option>
                </select>
                <input
                    type="text"
                    id="url-input"
                    name="url-input"
                    placeholder="www.example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-grow py-2.5 px-4 border-none outline-none text-base bg-transparent text-gray-800 placeholder-gray-500 rounded-r-lg"
                />
            </div>

            <div className="bg-gray-200 border-l-4 border-gray-500 p-4 rounded-lg mt-1 flex items-start">
                
                <p className="text-gray-800 text-sm leading-relaxed flex gap-x-1">
                    <CircleAlert />
                    Links found during crawling or sitemap retrieval may be updated if we discover new links or if some links
                    are invalid.
                </p>
            </div>

            <div className='flex space-x-4 mt-4'>
                <div className='space-y-1'>
                    <label htmlFor='include' className='text-md text-gray-700 font-medium'>Include Only Paths</label>
                    <input type='text' placeholder='Ex: blog/*, dev/*' className='w-full rounded-lg bg-gray-100 border-[0.5px] px-3 py-1 outline-none text-md border-gray-400' />
                </div>
                <div className='space-y-1'>
                    <label htmlFor='include' className='text-md text-gray-700 font-medium'>Exclude Paths</label>
                    <input type='text' placeholder='Ex: blog/*, dev/*' className='w-full rounded-lg bg-gray-100 border-[0.5px] px-3 py-1 outline-none text-md border-gray-400' />
                </div>
            </div>
    </>
  );
};

export default UrlInputForm;
