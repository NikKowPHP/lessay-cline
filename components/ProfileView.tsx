import { useState, useEffect } from 'react'
import type { FC, FormEvent, ChangeEvent } from 'react'
import React from 'react'
import { useSupabase } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  email: string
  avatarUrl?: string
  bio?: string
  targetLang: string
  nativeLang: string
  socialMediaLinks?: string[]
  memoryRetentionRate: number
  preferredReviewTime: string
  createdAt: string
}

interface ProfileForm {
  targetLang: string
  nativeLang: string
  bio?: string
  socialMediaLinks?: string[]
  memoryRetentionRate: number
  preferredReviewTime: string
}

export const ProfileView: FC = (): React.JSX.Element => {
  const supabase = useSupabase()
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<ProfileForm>({
    targetLang: '',
    nativeLang: '',
    bio: '',
    socialMediaLinks: [],
    memoryRetentionRate: 0.7,
    preferredReviewTime: 'morning'
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { error } = await supabase.auth.getUser()
        if (error) throw error
        
        const response = await fetch('/api/users/profile')
        if (!response.ok) throw new Error('Failed to fetch profile')
        
        const profile: UserProfile = await response.json()
        setUserData(profile)
        setFormData({
          targetLang: profile.targetLang,
          nativeLang: profile.nativeLang,
          memoryRetentionRate: profile.memoryRetentionRate,
          preferredReviewTime: profile.preferredReviewTime
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase.auth])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Update failed')
      
      const updatedProfile: UserProfile = await response.json()
      setUserData(updatedProfile)
      setEditMode(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!userData) return <div>No profile data found</div>

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      
      {!editMode ? (
        <div>
          <div className="flex items-center gap-4 mb-4">
            {userData.avatarUrl ? (
              <img
                src={userData.avatarUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No photo</span>
              </div>
            )}
          </div>
          <p>Email: {userData.email}</p>
          <p>Target Language: {userData.targetLang}</p>
          <p>Native Language: {userData.nativeLang}</p>
          <p>Memory Retention: {(userData.memoryRetentionRate * 100).toFixed(0)}%</p>
          <p>Preferred Review Time: {userData.preferredReviewTime}</p>
          {userData.bio && <p className="mt-2 text-gray-600">{userData.bio}</p>}
          {userData.socialMediaLinks && userData.socialMediaLinks.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">Social Media:</p>
              <ul className="list-disc pl-5">
                {userData.socialMediaLinks?.map((link: string, index: number) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Target Language</label>
            <input
              type="text"
              value={formData.targetLang}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, targetLang: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block">Native Language</label>
            <input
              type="text"
              value={formData.nativeLang}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, nativeLang: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block">Bio</label>
            <textarea
              value={formData.bio || ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, bio: e.target.value})}
              className="w-full p-2 border rounded h-32"
            />
          </div>

          <div>
            <label className="block">Social Media Links (one per line)</label>
            <textarea
              value={formData.socialMediaLinks?.join('\n') || ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({
                ...formData,
                socialMediaLinks: e.target.value.split('\n').filter((link: string) => link.trim())
              })}
              className="w-full p-2 border rounded h-32"
            />
          </div>

          <div>
            <label className="block">Memory Retention Rate</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.memoryRetentionRate}
              onChange={(e) => setFormData({...formData, memoryRetentionRate: parseFloat(e.target.value)})}
              className="w-full"
            />
            <span>{(formData.memoryRetentionRate * 100).toFixed(0)}%</span>
          </div>

          <div>
            <label className="block">Preferred Review Time</label>
            <select
              value={formData.preferredReviewTime}
              onChange={(e) => setFormData({...formData, preferredReviewTime: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          <div>
            <label className="block">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0]
                if (file) {
                  const formData = new FormData()
                  formData.append('avatar', file)
                  try {
                    const response = await fetch('/api/users/profile/avatar', {
                      method: 'POST',
                      body: formData
                    })
                    if (!response.ok) throw new Error('Upload failed')
                    const { avatarUrl } = await response.json()
                    setUserData((prev: UserProfile | null) => prev ? {...prev, avatarUrl} : null)
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Upload failed')
                  }
                }
              }}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}