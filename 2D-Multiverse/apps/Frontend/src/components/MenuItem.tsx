interface MenuItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

export function MenuItem({ icon, children, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="menu-item"
    >
      {icon && <span className="menu-item-icon">{icon}</span>}
      {children}
    </button>
  );
}