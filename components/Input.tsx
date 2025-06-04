import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input as GlueStackInput, InputField } from "@/components/ui/input";
import { AlertCircleIcon } from "lucide-react-native";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Box } from "./ui/box";

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  errors?: Record<string, any>;
  labelClassName?: string;
  inputClassName?: string;
  helperText?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  disabled?: boolean;
} & React.ComponentProps<typeof InputField>;

function Input<T extends FieldValues>({
  name,
  control,
  label,
  errors,
  labelClassName = "",
  inputClassName = "",
  left,
  right,
  helperText,
  disabled,
  ...rest
}: InputProps<T>) {
  const hasError = errors && errors[name];

  return (
    <FormControl isInvalid={!!hasError} size={"lg"} isDisabled={disabled}>
      {label && (
        <FormControlLabel>
          <FormControlLabelText className={labelClassName}>
            {label}
          </FormControlLabelText>
        </FormControlLabel>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <GlueStackInput
            className={`rounded-md bg-gray-600 ${inputClassName}`}
          >
            <Box className="px-2">{left}</Box>
            <InputField
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className={`flex-1 rounded-md text-typography-50 ${inputClassName}`}
              {...rest}
            />
            <Box className="px-2">{right}</Box>
          </GlueStackInput>
        )}
      />

      {helperText && (
        <FormControlHelper>
          <FormControlHelperText>{helperText}</FormControlHelperText>
        </FormControlHelper>
      )}

      {hasError && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            {errors[name]?.message || "Invalid input."}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}

export default Input;
