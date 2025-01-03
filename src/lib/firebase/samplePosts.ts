import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { auth, db } from './';
import { createPost } from './posts';

const sampleUsers = [
  {
    email: 'sarah@example.com',
    password: 'password123',
    displayName: 'Sarah Chen',
    posts: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963',
        caption: 'Beautiful sunset in Italy 🌅'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9',
        caption: 'Venice canals are magical ⛵'
      }
    ]
  },
  {
    email: 'alex@example.com',
    password: 'password123',
    displayName: 'Alex Thompson',
    posts: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1533050487297-09b450131914',
        caption: 'Coffee and code ☕💻'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
        caption: 'Weekend hiking adventures 🏔️'
      }
    ]
  }
];

export async function createSamplePosts() {
  // Check if posts already exist
  const postsQuery = query(collection(db, 'posts'), limit(1));
  const postsSnapshot = await getDocs(postsQuery);
  
  if (!postsSnapshot.empty) {
    return; // Posts already exist, no need to create samples
  }

  for (const user of sampleUsers) {
    try {
      // Try to sign in first
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
      } catch (signInError) {
        // If sign in fails, create new user
        userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      }

      // Update profile
      await updateProfile(userCredential.user, {
        displayName: user.displayName,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random`
      });

      // Create posts for user
      for (const post of user.posts) {
        // Convert URL to File object
        const response = await fetch(post.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

        await createPost(
          userCredential.user.uid,
          file,
          post.caption,
          user.displayName,
          userCredential.user.photoURL || ''
        );
      }

      console.log(`Created/Updated posts for ${user.displayName}`);
    } catch (error) {
      console.error(`Error handling posts for ${user.email}:`, error);
    }
  }
}