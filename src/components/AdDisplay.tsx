import React, { useEffect, useRef } from 'react';

interface AdDisplayProps {
  htmlSnippet?: string;
  type: 'banner' | 'native';
}

export const AdDisplay: React.FC<AdDisplayProps> = ({ htmlSnippet, type }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !htmlSnippet || htmlSnippet.trim() === '') return;

    // Clear previous
    containerRef.current.innerHTML = '';

    // If it contains a script tag, execute it properly
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlSnippet.trim();

    Array.from(tempDiv.childNodes).forEach((node) => {
      if (node.nodeName === 'SCRIPT') {
        const script = document.createElement('script');
        Array.from((node as HTMLScriptElement).attributes).forEach((attr) => {
          script.setAttribute(attr.name, attr.value);
        });
        script.innerHTML = (node as HTMLScriptElement).innerHTML;
        containerRef.current?.appendChild(script);
      } else {
        containerRef.current?.appendChild(node.cloneNode(true));
      }
    });
  }, [htmlSnippet]);

  if (!htmlSnippet || htmlSnippet.trim() === '') return null;

  return (
    <div className={`overflow-hidden rounded-2xl bg-white border border-emerald-100 shadow-2xs my-2 text-center ${
      type === 'banner' ? 'p-2 min-h-[60px]' : 'p-3 min-h-[100px]'
    }`}>
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
          স্পন্সরড অ্যাড
        </span>
      </div>
      <div ref={containerRef} className="flex justify-center items-center overflow-x-auto" />
    </div>
  );
};
