'use client';

import { Hunyuan } from '@lobehub/icons'; // TODO: 
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';

import { SenseCoreProviderCard } from '@/config/modelProviders';
import { GlobalLLMProviderKey } from '@/types/user/settings';

import { KeyVaultsConfigKey } from '../../const';
import { ProviderItem } from '../../type';

const providerKey: GlobalLLMProviderKey = 'sensecore';

export const useSenseCoreProvider = (): ProviderItem => {
  const { t } = useTranslation('modelProvider');

  return {
    ...SenseCoreProviderCard,
    apiKeyItems: [
      {
        children: (
          <Input.Password
            autoComplete={'new-password'}
            placeholder={t(`${providerKey}.accessKeyID.placeholder`)}
          />
        ),
        desc: t(`${providerKey}.accessKeyID.desc`),
        label: t(`${providerKey}.accessKeyID.title`),
        name: [KeyVaultsConfigKey, providerKey, 'accessKeyID'],
      },
      {
        children: (
          <Input.Password
            autoComplete={'new-password'}
            placeholder={t(`${providerKey}.accessKeySecret.placeholder`)}
          />
        ),
        desc: t(`${providerKey}.accessKeySecret.desc`),
        label: t(`${providerKey}.accessKeySecret.title`),
        name: [KeyVaultsConfigKey, providerKey, 'accessKeySecret'],
      },
    ],
    title: <Hunyuan.Combine size={32} type={'color'} />,
  };
};
