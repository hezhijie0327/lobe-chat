import systemAgentForm from './features/createSystemAgentForm';

const Page = () => {
  return (
    <>
      <systemAgentForm systemAgentKey="topic" />
      <systemAgentForm systemAgentKey="translation" />
      <systemAgentForm systemAgentKey="agentMeta" />
    </>
  );
};

Page.displayName = 'SystemAgent';

export default Page;
