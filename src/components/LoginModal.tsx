import { BurgerBoxLogin } from "./BurgerBoxLogin";

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <BurgerBoxLogin open={open} onClose={onClose} />;
}

