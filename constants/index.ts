export const primaryColors = {
  '--color-primary-0': '#dbe6fe',
  '--color-primary-50': '#b9cdfc',
  '--color-primary-100': '#97b4f8',
  '--color-primary-200': '#769af3',
  '--color-primary-300': '#567fee',
  '--color-primary-400': '#567fee',
  '--color-primary-500': '#567fee',
  '--color-primary-600': '#3862e7',
  '--color-primary-700': '#2a4bb5',
  '--color-primary-800': '#1c3586',
  '--color-primary-900': '#0f2159',
  '--color-primary-950': '#050e30',
} as const

export const defaultGradient = [ primaryColors["--color-primary-900"], primaryColors["--color-primary-800"]] as const

export const getStartedTexts = [
                "Connect with your team and family anytime anywhere.",
                "Smart location tracking for both work and home.",
                "Ensure safety for loved ones and boost workplace efficiency.",
              ]
export const userModes = ["Individual", "Agent", "Organisation"] as const