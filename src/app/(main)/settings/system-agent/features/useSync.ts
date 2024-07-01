import { FormInstance } from 'antd';
import { useEffect } from 'react';
import { useUserStore } from '@/store/user';

export const useSyncSystemAgent = (form: FormInstance, settings: any) => {
  useEffect(() => {
    form.setFieldsValue(useUserStore.getState().settings.systemAgent);

    const unsubscribe = useUserStore.subscribe(
      (s) => s.settings.systemAgent,
      (settings) => {
        form.setFieldsValue(settings);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [form, settings]);
};
