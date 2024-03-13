import type { Theme } from '@unocss/preset-mini'
import { h } from '@unocss/preset-mini/utils'
import type { Preset, Rule, UserShortcuts } from 'unocss'

// SECTION: constants
export const CSS_VARIABLE_PREFIX = '--una'
export const ENTER_ANIMATION_NAME = 'una-in'
export const EXIT_ANIMATION_NAME = 'una-out'
export const DEFAULT_SLIDE_TRANSLATE = '100%'

// SECTION utils
function normalizeDirection(dir: string | undefined): string | undefined {
  const dirMap: Record<string, string> = {
    t: 'top',
    b: 'bottom',
    l: 'left',
    r: 'right',
  }

  return dirMap[dir ?? ''] ?? dir
}

export function handleSlide(val: string | undefined, dir: string | undefined): [value?: string | undefined, direction?: string | undefined] {
  let value = h.cssvar.fraction.rem(val || DEFAULT_SLIDE_TRANSLATE)

  if (!value)
    return []

  dir = normalizeDirection(dir)

  if (!value.startsWith('var(--') && ['top', 'left'].includes(dir ?? '')) {
    if (value.startsWith('-'))
      value = value.slice(1)
    else if (value !== '0')
      value = `-${value}`
  }

  return [value, dir]
}

// SECTION: shortcuts
export const shortcuts: UserShortcuts<Theme> = [
  [
    /^animate-in$/,
    (_, { theme }) => [
      `keyframes-${ENTER_ANIMATION_NAME}`,
      {
        'animation-name': ENTER_ANIMATION_NAME,
        'animation-duration': theme.duration?.DEFAULT,
        [`${CSS_VARIABLE_PREFIX}-enter-opacity`]: 'initial',
        [`${CSS_VARIABLE_PREFIX}-enter-scale`]: 'initial',
        [`${CSS_VARIABLE_PREFIX}-enter-rotate`]: 'initial',
        [`${CSS_VARIABLE_PREFIX}-enter-translate-x`]: 'initial',
        [`${CSS_VARIABLE_PREFIX}-enter-translate-y`]: 'initial',
      },
    ],
    { autocomplete: 'animate-in' },
  ],
  [
    /^animate-out$/,
    (_, { theme }) => [
      `keyframes-${EXIT_ANIMATION_NAME}`,
      {
        'animation-name': EXIT_ANIMATION_NAME,
        'animation-duration': theme.duration?.DEFAULT,
        [`${CSS_VARIABLE_PREFIX}-exit-opacity`]: 'initial',
        [`${CSS_VARIABLE_PREFIX}-exit-scale`]: 'initial',
        [`${CSS_VARIABLE_PREFIX}-exit-rotate`]: 'initial',
        [`${CSS_VARIABLE_PREFIX}-exit-translate-x`]: 'initial',
        [`${CSS_VARIABLE_PREFIX}-exit-translate-y`]: 'initial',
      },
    ],
    { autocomplete: 'animate-out' },
  ],
]

// SECTION: rules
const DEFAULT_FADE_OPACITY = '0'
const DEFAULT_ZOOM_SCALE = '0'
const DEFAULT_SPIN_DEGREE = '30deg'

const DIRECTIONS_AUTOCOMPLETE = '(t|b|l|r|top|bottom|left|right)'

const fadeRules: Rule<Theme>[] = [
  [
    /^fade-in(?:-(.+))?$/,
    ([, op]) => ({
      [`${CSS_VARIABLE_PREFIX}-enter-opacity`]: h.cssvar.percent(op || DEFAULT_FADE_OPACITY),
    }),
    { autocomplete: 'fade-(in|out)-<percent>' },
  ],
  [
    /^fade-out(?:-(.+))?$/,
    ([, op]) => ({
      [`${CSS_VARIABLE_PREFIX}-exit-opacity`]: h.cssvar.percent(op || DEFAULT_FADE_OPACITY),
    }),
  ],
]

const zoomRules: Rule<Theme>[] = [
  [
    /^zoom-in(?:-(.+))?$/,
    ([, scale]) => ({
      [`${CSS_VARIABLE_PREFIX}-enter-scale`]: h.cssvar.fraction.percent(scale || DEFAULT_ZOOM_SCALE),
    }),
    { autocomplete: 'zoom-(in|out)-<percent>' },
  ],
  [
    /^zoom-out(?:-(.+))?$/,
    ([, scale]) => ({
      [`${CSS_VARIABLE_PREFIX}-exit-scale`]: h.cssvar.fraction.percent(scale || DEFAULT_ZOOM_SCALE),
    }),
  ],
]

const spinRules: Rule<Theme>[] = [
  [
    /^spin-in(?:-(.+))?$/,
    ([, deg]) => ({
      [`${CSS_VARIABLE_PREFIX}-enter-rotate`]: h.cssvar.degree(deg || DEFAULT_SPIN_DEGREE),
    }),
    { autocomplete: 'spin-(in|out)-<percent>' },
  ],
  [
    /^spin-out(?:-(.+))?$/,
    ([, deg]) => ({
      [`${CSS_VARIABLE_PREFIX}-exit-rotate`]: h.cssvar.degree(deg || DEFAULT_SPIN_DEGREE),
    }),
  ],
]

const slideRules: Rule<Theme>[] = [
  [
    /^slide-in(?:-from)?-(t|b|l|r|top|bottom|left|right)(?:-(.+))?$/,
    ([, dir, val]) => {
      const [value, direction] = handleSlide(val, dir)

      if (!value)
        return

      switch (direction) {
        case 'top':
        case 'bottom':
          return { [`${CSS_VARIABLE_PREFIX}-enter-translate-y`]: value }
        case 'left':
        case 'right':
          return { [`${CSS_VARIABLE_PREFIX}-enter-translate-x`]: value }
        default:
      }
    },
    {
      autocomplete: [
        `slide-(in|out)-${DIRECTIONS_AUTOCOMPLETE}-<percent>`,
        `slide-(in|out)-${DIRECTIONS_AUTOCOMPLETE}-full`,
        `slide-in-from-${DIRECTIONS_AUTOCOMPLETE}-<percent>`,
        `slide-in-from-${DIRECTIONS_AUTOCOMPLETE}-full`,
      ],
    },
  ],

  [
    /^slide-out(?:-to)?-(t|b|l|r|top|bottom|left|right)(?:-(.+))?$/,
    ([, dir, val]) => {
      const [value, direction] = handleSlide(val, dir)

      if (!value)
        return

      switch (direction) {
        case 'top':
        case 'bottom':
          return { [`${CSS_VARIABLE_PREFIX}-exit-translate-y`]: value }
        case 'left':
        case 'right':
          return { [`${CSS_VARIABLE_PREFIX}-exit-translate-x`]: value }
        default:
      }
    },
    {
      autocomplete: [
        `slide-out-to-${DIRECTIONS_AUTOCOMPLETE}-<percent>`,
        `slide-out-to-${DIRECTIONS_AUTOCOMPLETE}-full`,
      ],
    },
  ],
]

export const rules: Rule<Theme>[] = [
  ...fadeRules,
  ...zoomRules,
  ...spinRules,
  ...slideRules,
]

// SECTION: ====================================================================
// types
export type ColorOptions = ThemeCSSVarsVariant

export interface PresetShadcnOptions {
  color?: ColorOptions
  radius?: number
}

// theme
type ThemeColorString = `${number} ${number}% ${number}%`
export const themeCSSVarKeys = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'success',
  'success-foreground',
  'warning',
  'warning-foreground',
] as const
export type ThemeCSSVarKey = (typeof themeCSSVarKeys)[number]

export type ThemeCSSVars = {
  [K in ThemeCSSVarKey]: ThemeColorString
}

export interface ThemeCSSVarsVariant {
  name: string
  light: ThemeCSSVars
  dark: ThemeCSSVars
}

// SECTION: utils
function generateColorCSSVars(color: ThemeCSSVars) {
  return Object.entries(color)
    .map(([key, value]) => {
      if (!themeCSSVarKeys.includes(key as ThemeCSSVarKey))
        return ''
      return `  --${key}: ${value};`
    })
    .filter(Boolean)
    .join('\n')
}

function generateRadiusCSSVars(radius: number) {
  return `  --radius: ${radius}rem;`
}

function getColorTheme(color: any) {
  const light: ThemeCSSVars = color.light
  const dark: ThemeCSSVars = color.dark
  const name: string = color.name

  return { light, dark, name }
}

export function generateCSSVars(
  theme: PresetShadcnOptions,
  onlyOne = true,
): string {
  const { color, radius = 0.5 } = theme
  const { light, dark, name } = getColorTheme(color)
  const lightVars = generateColorCSSVars(light)
  const darkVars = generateColorCSSVars(dark)

  if (!onlyOne) {
    return `.theme-${name} {
${lightVars}
${generateRadiusCSSVars(radius)}
}

.dark .theme-${name} {
${darkVars}
}`
  }

  return `:root {
${lightVars}
${generateRadiusCSSVars(radius)}
}

.dark {
${darkVars}
}`
}

export function presetHyrdUi(): Preset<Theme> {
  const options: PresetShadcnOptions = {
    color: {
      name: 'hyrd',
      light: {
        background: '0 0% 100%', // bgPrimary
        foreground: '222.2 84% 4.9%',
        card: '0 0% 100%',
        'card-foreground': '222.2 84% 4.9%',
        popover: '0 0% 100%',
        'popover-foreground': '222.2 84% 4.9%',
        primary: '210 100% 45%', // textMain
        'primary-foreground': '210 40% 98%',
        secondary: '180 5% 96%', // bgSecondary => secondary Company
        'secondary-foreground': '212.5 12.37% 38.04%', // secondaryText Company
        muted: '225 4% 62%', // textDisable
        'muted-foreground': '215.4 16.3% 46.9%',
        accent: '180 5% 96%', // bgTertiary
        'accent-foreground': '222.2 47.4% 11.2%',
        destructive: '0 89% 62%',
        'destructive-foreground': '210 40% 98%',
        border: '213 15% 86%',
        input: '213 15% 86%',
        ring: '213 15% 86%',
        success: '143 54% 35%',
        'success-foreground': '210 40% 98%',
        warning: '40 92% 53%',
        'warning-foreground': '210 40% 98%',
      },
      dark: {
        background: '220 7% 18%',
        foreground: '210 40% 98%',
        card: '220 7% 18%',
        'card-foreground': '210 40% 98%',
        popover: '220 7% 18%',
        primary: '210 100% 45%',
        'primary-foreground': '210 40% 98%',
        'popover-foreground': '210 40% 98%',
        secondary: '223 7% 20%',
        'secondary-foreground': '210 40% 98%',
        muted: '221 11% 34%',
        'muted-foreground': '215 20.2% 65.1%',
        accent: '228 7% 15%',
        'accent-foreground': '210 40% 98%',
        destructive: '0 89% 31%',
        'destructive-foreground': '210 40% 98%',
        border: '221 12% 30%',
        input: '221 12% 30%',
        ring: '221 12% 30%',
        success: '143 54% 35%',
        'success-foreground': '210 40% 98%',
        warning: '40 92% 53%',
        'warning-foreground': '210 40% 98%',
      },
    },
    radius: 0.625,
  }

  return {
    name: 'unocss-preset-hyrd-ui',
    preflights: [
      {
        getCSS: () => `
          @keyframes shadcn-down { from{ height: 0 } to { height: var(--radix-accordion-content-height)} }
          @keyframes shadcn-up { from{ height: var(--radix-accordion-content-height)} to { height: 0 } }
          @keyframes shadcn-collapsible-down { from{ height: 0 } to { height: var(--radix-collapsible-content-height)} }
          @keyframes shadcn-collapsible-up { from{ height: var(--radix-collapsible-content-height)} to { height: 0 } }

          ${generateCSSVars(options)}

          * {
            border-color: hsl(var(--border));
          }

          body {
            color: hsl(var(--foreground));
            background: hsl(var(--background));
          }
        `,
      },
    ],
    theme: {
      animation: {
        keyframes: {
          [ENTER_ANIMATION_NAME]: `{from{opacity:var(${CSS_VARIABLE_PREFIX}-enter-opacity,1);transform:translate3d(var(${CSS_VARIABLE_PREFIX}-enter-translate-x,0),var(${CSS_VARIABLE_PREFIX}-enter-translate-y,0),0) scale3d(var(${CSS_VARIABLE_PREFIX}-enter-scale,1),var(${CSS_VARIABLE_PREFIX}-enter-scale,1),var(${CSS_VARIABLE_PREFIX}-enter-scale,1)) rotate(var(${CSS_VARIABLE_PREFIX}-enter-rotate,0))}}`,
          [EXIT_ANIMATION_NAME]: `{to{opacity:var(${CSS_VARIABLE_PREFIX}-exit-opacity,1);transform:translate3d(var(${CSS_VARIABLE_PREFIX}-exit-translate-x,0),var(${CSS_VARIABLE_PREFIX}-exit-translate-y,0),0) scale3d(var(${CSS_VARIABLE_PREFIX}-exit-scale,1),var(${CSS_VARIABLE_PREFIX}-exit-scale,1),var(${CSS_VARIABLE_PREFIX}-exit-scale,1)) rotate(var(${CSS_VARIABLE_PREFIX}-exit-rotate,0))}}`,
        },
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
    shortcuts,
    rules: [
      ...rules,
      [
        'animate-accordion-down',
        {
          animation: 'shadcn-down 0.2s ease-out',
        },
      ],
      [
        'animate-accordion-up',
        {
          animation: 'shadcn-up 0.2s ease-out',
        },
      ],
      [
        'animate-collapsible-down',
        {
          animation: 'shadcn-collapsible-down 0.2s ease-out',
        },
      ],
      [
        'animate-collapsible-up',
        {
          animation: 'shadcn-collapsible-up 0.2s ease-out',
        },
      ],
    ],
  }
}
