import { Avatar } from 'antd';
import { useTheme } from 'antd-style';
import { memo } from 'react';

import { CATEGORY_ICON_MAP } from '../const';

interface CategoryAvatarProps {
  category: string;
}

export const CategoryAvatar = memo<CategoryAvatarProps>(({ category }) => {
  const theme = useTheme();
  const IconComponent = CATEGORY_ICON_MAP[category];

  return (
    <Avatar
      alt={category}
      icon={<IconComponent size={16} />}
      style={{
        backgroundColor: 'transparent',
        color: theme.colorTextSecondary,
        fontSize: 16,
      }}
    />
  );
});
