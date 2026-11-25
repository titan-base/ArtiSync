type LoginStateChecks = {
  hasSession: () => Promise<boolean>;
  hasPasskey: () => Promise<boolean>;
};

// セッションとパスキーの登録状況からログイン状態を判定する。
export async function resolveLoginState({ hasSession, hasPasskey }: LoginStateChecks) {
  if (!(await hasSession())) return "signed-out";

  return (await hasPasskey()) ? "ready" : "passkey-required";
}
