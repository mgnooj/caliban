import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/caliban/', // must exactly match your repo name, case-sensitive, with slashes
})

