const processSenseNovaV6Content = (content: any) => {
  if (typeof content === 'string') {
    return [{ type: 'text', text: content }];
  }

  return content
    ?.map((item: any) => {
      if (item.type === 'text') return item;

      if (item.type === 'image_url' && item.image_url?.url) {
        const url = item.image_url.url;
        return url.startsWith('data:image/jpeg;base64') 
          ? { 
              type: 'image_base64', 
              image_base64: url.split(',')[1] 
            }
          : { type: 'image_url', image_url: url };
      }

      return null;
    })
    .filter(Boolean);
};
