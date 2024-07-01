import createFormSystemAgent from './features/createForm';

const Page = () => {
  return (
    <>
      <createFormSystemAgent systemAgentKey="topic" />
      <createFormSystemAgent systemAgentKey="translation" />
      <createFormSystemAgent systemAgentKey="agentMeta" />
    </>
  );
};

Page.displayName = 'SystemAgent';

export default Page;
