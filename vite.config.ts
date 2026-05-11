import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkgfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import path from 'path'
import contentGen from 'vite-plugin-mdx-content'

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true
    }),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkgfm],
      rehypePlugins: [
        [rehypePrettyCode, { theme: 'github-dark' }]
      ]
    }),
    react(),
    tailwindcss(),
    contentGen()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '#components': path.resolve(__dirname, './src/shared/components')
    }
  }
})