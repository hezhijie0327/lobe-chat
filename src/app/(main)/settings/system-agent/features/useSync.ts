import { FormInstance } from 'antd';
import { useEffect } from 'react';
import { useUserStore } from '@/store/user';

export const useSyncSystemAgent = (form: FormInstance, settings: any) => {
  useEffect(() => {
    // Set initial form values
    form.setFieldsValue(settings);

    // Sync form values with updated settings
    const unsubscribe = useUserStore.subscribe(
      (state) => state.settings.systemAgent,
      (newSettings) => {
        form.setFieldsValue(newSettings);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [form, settings]);
};
