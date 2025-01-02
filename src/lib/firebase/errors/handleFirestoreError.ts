import toast from 'react-hot-toast';

export function handleFirestoreError(error: any) {
  console.error('Firestore Error:', error);

  if (error.code === 'failed-precondition') {
    const indexUrl = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]*/);
    if (indexUrl) {
      toast.error(
        'Database index needs to be created. Please contact the administrator.',
        { duration: 5000 }
      );
      console.info('Create the following index:', indexUrl[0]);
      return;
    }
  }
  
  toast.error('Failed to load data');
}