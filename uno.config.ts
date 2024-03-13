import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetHyrdUi } from './hyrd-ui.preset'

export default defineConfig({
  shortcuts: [
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetHyrdUi(),
    presetIcons({
      scale: 1.2,
      autoInstall: true,
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
