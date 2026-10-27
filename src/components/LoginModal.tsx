import { BurgerBoxLogin } from "./BurgerBoxLogin";
import { UserProfileModal } from "./UserProfileModal";
import { useAuth } from "@/context/AuthContext";

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();

  if (user) {
    return <UserProfileModal open={open} onClose={onClose} />;
  }

  return <BurgerBoxLogin open={open} onClose={onClose} />;
}
