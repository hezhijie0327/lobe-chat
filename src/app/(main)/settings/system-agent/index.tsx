import SystemAgentForm from './features/createSystemAgentForm';

const Page = () => {
  return (
    <>
      <SystemAgentForm systemAgentKey="topic" />
      <SystemAgentForm systemAgentKey="translation" />
      <SystemAgentForm systemAgentKey="agentMeta" />
    </>
  );
};

Page.displayName = 'SystemAgent';

export default Page;
