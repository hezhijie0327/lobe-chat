import { FormInstance } from 'antd';
import { useEffect } from 'react';
import { useUserStore } from '@/store/user';

export const useSyncSystemAgent = (form: FormInstance, settings: any) => {
  useEffect(() => {
    form.setFieldsValue(settings);

    const unsubscribe = useUserStore.subscribe(
      (s) => s.settings.systemAgent,
      (newSettings) => {
        form.setFieldsValue(newSettings);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [form, settings]);
};
