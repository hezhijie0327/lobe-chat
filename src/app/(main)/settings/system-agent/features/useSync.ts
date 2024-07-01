import { FormInstance } from 'antd';
import { useEffect } from 'react';

import { useUserStore } from '@/store/user';

export const useSyncSystemAgent = (form: FormInstance) => {
  useEffect(() => {
    // set the first time
    //form.setFieldsValue(useUserStore.getState().settings.systemAgent);

    // sync with later updated settings
    const unsubscribe = useUserStore.subscribe(
      (s) => s.settings.systemAgent,
      (settings) => {
        form.setFieldsValue(settings);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [form]);
};
