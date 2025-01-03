import { Helmet } from 'react-helmet-async';
import RealtimeFeed from '../components/Home/RealtimeFeed';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import OfflineWarning from '../components/Home/OfflineWarning';

export default function Home() {
  const { isOnline } = useNetworkStatus();

  return (
    <>
      <Helmet>
        <title>Home | ChupKotha</title>
      </Helmet>

      <div className="max-w-2xl mx-auto space-y-4">
        <OfflineWarning isOnline={isOnline} />
        <RealtimeFeed />
      </div>
    </>
  );
}