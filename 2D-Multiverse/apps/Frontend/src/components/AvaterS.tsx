interface AvatarProps {
  imageUrl?: string|undefined;
  alt?: string;
}

export function AvatarS({ imageUrl, alt = 'User avatar' }: AvatarProps) {
  const effectiveImageUrl = imageUrl === undefined 
  ? "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" 
  : imageUrl;
    return (
    <div className="Avatar--div">
    <img
      src={effectiveImageUrl}
      alt={alt}
      className="avatar"
    />
    </div>
  );
}