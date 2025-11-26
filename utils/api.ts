// API utility functions for backend communication

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://mochila-app-backend.vercel.app/api';

export interface UserProfile {
  email: string;
  gender?: string;
  travelCompanionPreferences?: string[];
  activityInterests?: string[];
  personalityTraits?: string[];
  matchPreference?: string;
  birthday?: string;
  region?: string;
  purposeOfUse?: string[];
  howDidYouLearn?: string;
  displayName?: string;
  emailNotifications?: {
    allAgreed: boolean;
    messagesAgreed: boolean;
    campaignsAgreed: boolean;
  };
  occupation?: string;
  travelDestination?: string;
  profilePhotoUrl?: string;
}

export const saveUserProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error saving profile:', errorData);
      console.error('Error details:', errorData.details);
      return false;
    }

    const data = await response.json();
    console.log('Profile saved successfully:', data);
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
};

export const getUserProfile = async (email: string): Promise<UserProfile | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // User not found
      }
      throw new Error('Failed to get profile');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

export const uploadProfilePhoto = async (
  email: string,
  imageUri: string,
  filter?: string
): Promise<string | null> => {
  try {
    // Create FormData for React Native
    const formData = new FormData();
    
    // For React Native, we need to append the file differently
    // The imageUri should be a local file URI
    formData.append('photo', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile-photo.jpg',
    } as any);
    
    formData.append('email', email);
    if (filter) {
      formData.append('filter', filter);
    }

    const uploadResponse = await fetch(`${API_BASE_URL}/user/profile/photo`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let React Native set it with boundary
        'Accept': 'application/json',
      },
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error('Error uploading photo:', errorData);
      return null;
    }

    const data = await uploadResponse.json();
    console.log('Photo uploaded successfully:', data);
    return data.photoUrl || null;
  } catch (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
};

export interface Member {
  id: string;
  displayName: string;
  age: number;
  region: string;
  profilePhotoUrl?: string;
  isOnline: boolean;
  likes: number;
  views: number;
  matchRate: number;
}

export const getMembersList = async (sortBy: string = 'popular', currentUserEmail?: string): Promise<Member[]> => {
  try {
    const url = currentUserEmail 
      ? `${API_BASE_URL}/members?sort=${sortBy}&excludeEmail=${encodeURIComponent(currentUserEmail)}`
      : `${API_BASE_URL}/members?sort=${sortBy}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get members list');
    }

    const data = await response.json();
    return data.members || [];
  } catch (error) {
    console.error('Error getting members list:', error);
    return [];
  }
};

export interface MemberProfile {
  id: string;
  displayName: string;
  age: number;
  region: string;
  hometown?: string;
  profilePhotoUrl?: string;
  photos?: string[];
  isOnline: boolean;
  matchRate: number;
  interests?: string[];
  videoCallOk?: boolean;
  selfIntroduction?: string;
  height?: string;
  bodyType?: string;
  charmPoints?: string[];
  personality?: string[];
  languages?: string[];
  bloodType?: string;
  siblings?: string;
  occupation?: string;
  income?: string;
  education?: string;
  likes?: number;
  views?: number;
}

export const getMemberProfile = async (memberId: string, viewerId?: string): Promise<MemberProfile | null> => {
  try {
    const url = viewerId 
      ? `${API_BASE_URL}/members/${memberId}?viewerId=${viewerId}`
      : `${API_BASE_URL}/members/${memberId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to get member profile');
    }

    const data = await response.json();
    return data.member;
  } catch (error) {
    console.error('Error getting member profile:', error);
    return null;
  }
};

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  timestamp: string;
  user?: MemberProfile;
}

export const getLikesReceived = async (userId: string): Promise<Like[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/members/likes/received/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get likes received');
    }

    const data = await response.json();
    return data.likes || [];
  } catch (error) {
    console.error('Error getting likes received:', error);
    return [];
  }
};

export interface Footprint {
  id: string;
  viewerId: string;
  viewedId: string;
  timestamp: string;
  user?: MemberProfile;
}

export const getFootprints = async (userId: string): Promise<Footprint[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/members/footprints/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get footprints');
    }

    const data = await response.json();
    return data.footprints || [];
  } catch (error) {
    console.error('Error getting footprints:', error);
    return [];
  }
};

export const addLike = async (fromUserId: string, toUserId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/members/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fromUserId, toUserId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error adding like:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error adding like:', error);
    return false;
  }
};

export const uploadAdditionalPhoto = async (
  email: string,
  imageUri: string
): Promise<string | null> => {
  try {
    const formData = new FormData();
    
    formData.append('photo', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'additional-photo.jpg',
    } as any);
    
    formData.append('email', email);
    formData.append('isAdditional', 'true');

    const uploadResponse = await fetch(`${API_BASE_URL}/user/profile/photo`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error('Error uploading additional photo:', errorData);
      return null;
    }

    const data = await uploadResponse.json();
    return data.photoUrl || null;
  } catch (error) {
    console.error('Error uploading additional photo:', error);
    return null;
  }
};

