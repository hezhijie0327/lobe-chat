import { SenseNova } from '@lobehub/icons';
import { Input } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { ModelProvider } from '@/libs/agent-runtime';
import { useUserStore } from '@/store/user';
import { keyVaultsConfigSelectors } from '@/store/user/selectors';

import { FormAction } from '../style';

const SenseNovaForm = memo(() => {
  const { t } = useTranslation('modelProvider');

  const [sensecoreAccessKeyID, sensecoreAccessKeySecret, setConfig] = useUserStore((s) => [
    keyVaultsConfigSelectors.sensenovaConfig(s).sensecoreAccessKeyID,
    keyVaultsConfigSelectors.sensenovaConfig(s).sensecoreAccessKeySecret,
    s.updateKeyVaultConfig,
  ]);

  return (
    <FormAction
      avatar={<SenseNova color={SenseNova.colorPrimary} size={56} />}
      description={t('sensenova.unlock.description')}
      title={t('sensenova.unlock.title')}
    >
      <Input.Password
        autoComplete={'new-password'}
        onChange={(e) => {
          setConfig(ModelProvider.SenseNova, { sensecoreAccessKeyID: e.target.value });
        }}
        placeholder={t('sensenova.sensecoreAccessKeyID.placeholder')}
        type={'block'}
        value={sensecoreAccessKeyID}
      />
      <Input.Password
        autoComplete={'new-password'}
        onChange={(e) => {
          setConfig(ModelProvider.SenseNova, { sensecoreAccessKeySecret: e.target.value });
        }}
        placeholder={t('sensenova.sensecoreAccessKeySecret.placeholder')}
        type={'block'}
        value={sensecoreAccessKeySecret}
      />
    </FormAction>
  );
});

export default SenseNovaForm;
