import { Button } from "@nextui-org/button";
import { useFormStatus } from "react-dom";

type FormButtonProps = {
  color:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
  children: string;
};

export default function FormButton({ color, children }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button color={color} isDisabled={pending} type="submit">
      {children}
    </Button>
  );
}
