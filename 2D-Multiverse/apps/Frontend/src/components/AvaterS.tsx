interface AvatarProps {
  imageUrl: string|undefined;
  alt?: string;
}

export function AvatarS({ imageUrl, alt = 'User avatar' }: AvatarProps) {
    imageUrl===undefined?"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y":imageUrl;
  return (
    <img
      src={imageUrl}
      alt={alt}
      className="avatar"
    />
  );
}