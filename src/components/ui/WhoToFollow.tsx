"use client";

import { useState, useEffect } from 'react';
import { Profile } from '@/lib/models';

export function WhoToFollow() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/profiles');

        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }

        const data = await response.json();
        setProfiles(data);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');

        // Fallback to localStorage if API fails
        const savedProfiles = localStorage.getItem('profiles');
        if (savedProfiles) {
          try {
            setProfiles(JSON.parse(savedProfiles));
            setError(null);
          } catch (e) {
            console.error('Error parsing profiles from localStorage:', e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Who to follow</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start justify-between animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Who to follow</h2>
        <div className="p-4 bg-red-50 rounded-md">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Who to follow</h2>
      <div className="space-y-4">
        {profiles.map((profile) => (
          <div key={profile._id?.toString()} className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {/* Fallback for missing images */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  {profile.name.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="font-medium">{profile.name}</h3>
                <p className="text-sm text-gray-600">{profile.bio}</p>
                {profile.description && (
                  <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
                )}
              </div>
            </div>
            <a
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-button py-1 px-3 text-sm"
            >
              Follow
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
