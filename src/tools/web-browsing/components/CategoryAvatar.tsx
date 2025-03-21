import { Avatar } from 'antd';
import { useTheme } from 'antd-style';
import { memo } from 'react';

import { CATEGORY_ICON_MAP } from '../const';

interface CategoryAvatarProps {
  category: string;
}

export const CategoryAvatar = memo<EngineAvatarProps>(({ category }) => (
  const theme = useTheme();

  return (
    <Avatar
      alt={category}
      src={CATEGORY_ICON_MAP[category]}
      style={{
        backgroundColor: 'transparent',
        color: theme.colorTextSecondary,
        height: 16,
        width: 16,
      }}
    />
  );
));
