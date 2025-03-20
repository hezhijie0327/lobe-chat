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
  ({ category, size = 28 }) => {
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
          style={{ fontWeight: 'bold' }}
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
              height: 24,
              width: 24,
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CategoryAvatar 
              category={category} 
              size={18}
              style={{ fontWeight: 'bold' }}
            />
          </Avatar>
        ))}
      </Avatar.Group>
    );
  },
);
