import { Avatar } from 'antd';
import { useTheme } from 'antd-style';
import { memo } from 'react';

import { CATEGORY_ICON_MAP } from '../const';

interface CategoryAvatarProps {
  category: string;
  size?: number;
}

interface CategoryAvatarGroupProps {
  categories: string[];
}

export const CategoryAvatar = memo<CategoryAvatarProps>(
  ({ category, size = 26 }) => {
    const Icon = CATEGORY_ICON_MAP[category];
    const theme = useTheme();

    return (
      <Avatar
        alt={category}
        style={{
          backgroundColor: 'transparent',
          color: theme.colorTextSecondary,
          display: 'flex',
          height: size,
          width: size,
        }}
      >
        <Icon 
          size={size} 
        />
      </Avatar>
    );
  },
);

export const CategoryAvatarGroup = memo<CategoryAvatarGroupProps>(
  ({ categories }) => {
    const theme = useTheme();
    
    return (
      <Avatar.Group>
        {categories.map((category) => (
          <Avatar
            key={category}
            style={{
              background: theme.colorBgLayout,
              height: 16,
              width: 16,
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CategoryAvatar 
              category={category} 
              size={16}
            />
          </Avatar>
        ))}
      </Avatar.Group>
    );
  },
);
