import { FormInstance } from 'antd';
import { useLayoutEffect } from 'react';

import { useUserStore } from '@/store/user';

export const useSyncSystemAgent = (form: FormInstance) => {
  useLayoutEffect(() => {
    const initialSettings = useUserStore.getState().settings.systemAgent;
    if (initialSettings) {
      form.setFieldsValue(initialSettings);
    }

    const unsubscribe = useUserStore.subscribe(
      (state) => state.settings.systemAgent,
      (settings) => {
        if (settings) {
          form.setFieldsValue(settings);
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, [form]);
};
