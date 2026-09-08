import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@client/modules/design-system/components/shadcn-ui/input-group";
import { cn } from "cn";
import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";

export type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

export function PasswordInput({
  className,
  disabled,
  value,
  defaultValue,
  onChange,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(() => defaultValue?.toString() ?? "");
  const copyResetTimeoutRef = useRef<number | undefined>(undefined);

  const currentValue = value !== undefined ? String(value) : uncontrolledValue;

  useEffect(() => {
    return () => {
      window.clearTimeout(copyResetTimeoutRef.current);
    };
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (value === undefined) setUncontrolledValue(event.target.value);
    onChange?.(event);
  }

  async function handleCopy() {
    if (currentValue.length === 0 || disabled) return;
    try {
      await navigator.clipboard.writeText(currentValue);
      setCopied(true);
      window.clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <InputGroup className={cn(className)}>
      <InputGroupInput
        type={visible ? "text" : "password"}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        maxLength={256}
        onChange={handleChange}
        {...props}
      />
      <InputGroupAddon align="inline-end" className="gap-0">
        <InputGroupButton
          variant="ghost"
          size="icon-sm"
          className="hover:bg-transparent! size-7"
          disabled={disabled}
          onClick={() => setVisible((previous) => !previous)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
        <InputGroupButton
          variant="ghost"
          size="icon-sm"
          className="hover:bg-transparent! size-7"
          onClick={handleCopy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
