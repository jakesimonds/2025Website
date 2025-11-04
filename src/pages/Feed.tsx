import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import type { AppBskyFeedDefs } from '@atproto/api';

export const Feed: React.FC = () => {
  const { authState, logout } = useAuth();
  const [posts, setPosts] = useState<AppBskyFeedDefs.FeedViewPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const agent = authService.getAgent();
        const response = await agent.getTimeline({ limit: 50 });
        setPosts(response.data.feed);
      } catch (err) {
        setError('Failed to load feed');
        console.error('Feed error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bluesky</h1>
            <p className="text-sm text-gray-600">@{authState.handle}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your feed...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            {posts.map((item) => {
              const post = item.post;
              const author = post.author;
              const record = post.record as any;

              return (
                <article
                  key={post.uri}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition"
                >
                  {/* Author info */}
                  <div className="flex items-start space-x-3">
                    <img
                      src={author.avatar || 'https://via.placeholder.com/40'}
                      alt={author.displayName || author.handle}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 truncate">
                          {author.displayName || author.handle}
                        </span>
                        <span className="text-gray-500 text-sm truncate">
                          @{author.handle}
                        </span>
                        <span className="text-gray-400 text-sm">·</span>
                        <span className="text-gray-500 text-sm">
                          {formatDate(post.indexedAt)}
                        </span>
                      </div>

                      {/* Post content */}
                      <div className="mt-2 text-gray-900 whitespace-pre-wrap break-words">
                        {record.text}
                      </div>

                      {/* Engagement stats */}
                      <div className="mt-3 flex items-center space-x-6 text-gray-500 text-sm">
                        <span className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>{post.replyCount || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>🔄</span>
                          <span>{post.repostCount || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>❤️</span>
                          <span>{post.likeCount || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts to display</p>
            <p className="text-sm text-gray-500 mt-2">
              Follow some accounts to see their posts here
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
