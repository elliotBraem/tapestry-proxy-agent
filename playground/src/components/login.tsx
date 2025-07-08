import { useWorker } from "../contexts/worker-context";
import { Button } from "./ui/button";

export function Login() {
  const { login } = useWorker();

  return <Button onClick={login}>Login with NEAR</Button>;
}
