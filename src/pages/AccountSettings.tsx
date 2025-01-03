import { Helmet } from 'react-helmet-async';
import AccountInfo from '../components/Settings/AccountInfo';
import SecuritySettings from '../components/Settings/SecuritySettings';
import DangerZone from '../components/Settings/DangerZone';

export default function AccountSettings() {
  return (
    <>
      <Helmet>
        <title>Account Settings | ChupKotha</title>
      </Helmet>
      
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        
        <div className="space-y-6">
          <AccountInfo />
          <SecuritySettings />
          <DangerZone />
        </div>
      </div>
    </>
  );
}