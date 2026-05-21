// LoginPage - Login page wrapper

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";

export default function LoginPage() {
  const [showReset, setShowReset] = useState(false);

  if (showReset) {
    return (
      <PasswordResetForm
        onBackToLogin={() => setShowReset(false)}
      />
    );
  }

  return (
    <LoginForm
      onForgotPassword={() => setShowReset(true)}
    />
  );
}
