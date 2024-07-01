'use client';

import { Input } from 'antd';
import { useTranslation } from 'react-i18next';

import { SparkProviderCard } from '@/config/modelProviders';
import { GlobalLLMProviderKey } from '@/types/user/settings';

import { KeyVaultsConfigKey } from '../../const';
import { ProviderItem } from '../../type';
import { SparkBrand } from '../providers';

const providerKey: GlobalLLMProviderKey = 'spark';

export const useSparkProvider = (): ProviderItem => {
  const { t } = useTranslation('modelProvider');

  return {
    ...SparkProviderCard,
    apiKeyItems: [
      {
        children: (
          <Input.Password
            autoComplete={'new-password'}
            placeholder={t(`${providerKey}.sparkApiKey.placeholder`)}
          />
        ),
        desc: t(`${providerKey}.sparkApiKey.desc`),
        label: t(`${providerKey}.sparkApiKey.title`),
        name: [KeyVaultsConfigKey, providerKey, 'sparkApiKey'],
      },
      {
        children: (
          <Input.Password
            autoComplete={'new-password'}
            placeholder={t(`${providerKey}.sparkApiSecret.placeholder`)}
          />
        ),
        desc: t(`${providerKey}.sparkApiSecret.desc`),
        label: t(`${providerKey}.sparkApiSecret.title`),
        name: [KeyVaultsConfigKey, providerKey, 'sparkApiSecret'],
      },
    ],
    title: <SparkBrand />,
  };
};
