import { Textarea } from '@nextui-org/react'
import { ValidationRule, useFormContext } from 'react-hook-form'

type Props = {
  fieldName: string
  fieldTitle?: string
  helper?: JSX.Element
  defaultValue?: string
  placeholder?: string
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded'
  rows?: number
  validationOptions?: {
    maxLength?: number
    minLength?: number
    required?: boolean
    pattern?: ValidationRule<RegExp>
    setValueAs?: (value: any) => any
  }
}

export const TextAreaField = ({
  fieldTitle,
  fieldName,
  helper,
  defaultValue,
  placeholder,
  rows = 3,
  variant,
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
    <Textarea
      label={fieldTitle}
      labelPlacement="outside"
      variant={variant}
      isRequired={required}
      id={fieldName}
      rows={rows}
      defaultValue={defaultValue}
      placeholder={placeholder}
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
