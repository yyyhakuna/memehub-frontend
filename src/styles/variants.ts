import { cva, VariantProps } from 'class-variance-authority'

export const shadowVariants = cva('transition-all border-2 border-black', {
  variants: {
    shadow: {
      none: '',
      default:
        'shadow-offset hover:shadow-none hover:translate-x-offset hover:translate-y-offset',
    },
  },
  defaultVariants: {
    shadow: 'default',
  },
})

export type ShadowVariantsProps = VariantProps<typeof shadowVariants>

export const shadowBorderVariants = cva(
  'transition-all border-2 border-black',
  {
    variants: {
      shadow: {
        none: '',
        default:
          'hover:shadow-offset-border hover:-translate-x-offset hover:-translate-y-offset',
      },
    },
    defaultVariants: {
      shadow: 'default',
    },
  }
)

export type ShadowBorderVariantsProps = VariantProps<
  typeof shadowBorderVariants
>
