// Share Link Component
import React from "react";

interface ShareLinkProps {
  peerId: string;
  onCopyLink: () => void;
  linkCopied: boolean;
}

export const ShareLink: React.FC<ShareLinkProps> = ({
  peerId,
  onCopyLink,
  linkCopied,
}) => {
  return (
    <div className="absolute top-4 left-4 z-10 h-auto join-card md:top-auto md:bottom-4 share_card">
      <p className="mb-2 text-sm">Share this link with others to join:</p>
      <div className="flex flex-col items-center gap-2">
        <input
          type="text"
          value={linkCopied ? "Link copied!" : peerId}
          readOnly
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        />
        <button
          onClick={onCopyLink}
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {linkCopied ? "Copied ✅" : "Copy Link"}
        </button>
      </div>
    </div>
  );
};
