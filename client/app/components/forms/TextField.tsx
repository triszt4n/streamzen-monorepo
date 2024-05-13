import { Input } from '@nextui-org/react'
import { useFormContext, ValidationRule } from 'react-hook-form'

type Props = {
  fieldName: string
  fieldTitle?: string
  helper?: JSX.Element
  defaultValue?: string
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded'
  type?: 'text' | 'password' | 'email' | 'number'
  isClearable?: boolean
  validationOptions?: {
    maxLength?: number
    minLength?: number
    required?: boolean
    pattern?: ValidationRule<RegExp>
    setValueAs?: (value: any) => any
  }
}

export const TextField = ({
  fieldTitle,
  fieldName,
  helper,
  type = 'text',
  defaultValue,
  variant,
  isClearable,
  validationOptions: {
    maxLength,
    minLength,
    required,
    pattern,
    setValueAs,
  } = {},
}: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <Input
      label={fieldTitle}
      variant={variant}
      isRequired={required}
      id={fieldName}
      isClearable={isClearable}
      type={type}
      defaultValue={defaultValue}
      isInvalid={!!errors?.[fieldName]}
      errorMessage={errors?.[fieldName]?.message?.toString()}
      description={helper}
      {...register(fieldName, {
        required: required ? 'Required field' : false,
        maxLength: maxLength
          ? {
              value: maxLength,
              message: `Too long, maximum length is ${maxLength} characters`,
            }
          : undefined,
        minLength: minLength
          ? {
              value: minLength,
              message: `Too short, minimum length is ${minLength} characters`,
            }
          : undefined,
        pattern,
        setValueAs,
      })}
    />
  )
}
