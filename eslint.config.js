import js from '@eslint/js'
import importSort from 'eslint-plugin-simple-import-sort'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import vueEslintParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
	{
		// languageOptions 是 ESLint 8.0.0 引入的一个新属性，用于配置全局变量和解析器选项等。
		languageOptions: {
			// globals 是 ESLint 中用于定义全局变量的配置项。通过在 globals 中定义全局变量，可以告诉 ESLint 这些变量是全局可用的，并且可以指定它们的访问权限（如只读、可写等）。
			globals: {
				...globals.browser,
				computed: 'readonly',
				defineEmits: 'readonly',
				defineExpose: 'readonly',
				defineProps: 'readonly',
				onMounted: 'readonly',
				onUnmounted: 'readonly',
				reactive: 'readonly',
				ref: 'readonly',
				shallowReactive: 'readonly',
				shallowRef: 'readonly',
				toRef: 'readonly',
				toRefs: 'readonly',
				watch: 'readonly',
				watchEffect: 'readonly'
			}
		},
		// name 是 ESLint 8.0.0 引入的一个新属性，用于为配置项指定一个名称。这个名称可以在 ESLint 的输出中显示，帮助开发者更好地识别和区分不同的配置项。
		name: 'xxx/vue/setup',
		plugins: {
			vue: pluginVue // eslint-plugin-vue 是一个 ESLint 插件，用于在 Vue.js 项目中进行代码质量检查和风格规范的 enforcement。它提供了一系列规则和功能，帮助开发者编写更规范、可维护的 Vue.js 代码。
		}
	},
	{
		files: ['**/*.{ts,tsx,vue}'], // files 是 ESLint 8.0.0 引入的一个新属性，用于指定 ESLint 应该检查哪些文件。通过在 files 中定义文件模式，可以告诉 ESLint 只检查符合这些模式的文件，从而提高代码质量检查的效率和准确性。
		ignores: [],
		rules: {
			...js.configs.recommended.rules,
			...pluginVue.configs['flat/recommended'].rules,
			'no-unused-vars': 'error',
			'no-undef': 'warn',
			'no-console': 'error',
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'vue/valid-define-emits': 'error' // 这个规则用于检查 Vue.js 组件中 defineEmits 的使用是否正确。它会验证 defineEmits 的参数是否符合预期的格式，并且确保在组件中正确地使用了 defineEmits 来定义事件。通过启用这个规则，可以帮助开发者避免在 Vue.js 组件中使用 defineEmits 时出现错误，从而提高代码的质量和可维护性。
		},
		languageOptions: {
			parser: vueEslintParser, // vue-eslint-parser 是一个专门用于解析 Vue.js 文件的 ESLint 解析器。它能够正确地解析 Vue.js 文件中的模板、脚本和样式部分，并提供相应的抽象语法树（AST）供 ESLint 使用。通过使用 vue-eslint-parser，开发者可以在 Vue.js 项目中进行更准确和全面的代码质量检查和风格规范 enforcement。
			parserOptions: {
				ecmaVersion: 'latest', // ecmaVersion 是 ESLint 8.0.0 引入的一个新属性，用于指定 ECMAScript 的版本。通过在 parserOptions 中设置 ecmaVersion，可以告诉 ESLint 使用哪个版本的 ECMAScript 语法进行解析和检查。这有助于确保 ESLint 能够正确地理解和处理代码中的新特性和语法，从而提高代码质量检查的准确性。
				ecmaFeatures: {
					jsx: true
				},
				extraFileExtensions: ['.vue'], // extraFileExtensions 是 ESLint 8.0.0 引入的一个新属性，用于指定额外的文件扩展名。通过在 parserOptions 中设置 extraFileExtensions，可以告诉 ESLint 解析器除了默认的 JavaScript 文件扩展名之外，还应该解析哪些其他类型的文件。这对于一些特定的项目结构或使用了非标准文件扩展名的项目非常有用，可以确保 ESLint 能够正确地处理这些文件并进行代码质量检查。
				parser: tsParser,  // 解析 vue文件中的 typescript 代码
				// sourceType: 'module',
				project: ['./tsconfig.eslint.json', '**/*/tsconfig.json'], // project 是 ESLint 8.0.0 引入的一个新属性，用于指定 TypeScript 项目的配置文件。通过在 parserOptions 中设置 project，可以告诉 ESLint 使用哪个 tsconfig.json 文件来解析 TypeScript 代码。这对于使用 TypeScript 的项目非常重要，因为它可以确保 ESLint 能够正确地理解和处理 TypeScript 代码中的类型信息，从而提高代码质量检查的准确性。
				tsconfigRootDir: import.meta.dirname // tsconfigRootDir 是 ESLint 8.0.0 引入的一个新属性，用于指定 TypeScript 项目的根目录。通过在 parserOptions 中设置 tsconfigRootDir，可以告诉 ESLint 解析器在哪里查找 tsconfig.json 文件。这对于使用 TypeScript 的项目非常重要，因为它可以确保 ESLint 能够正确地找到和使用 tsconfig.json 文件中的配置，从而提高代码质量检查的准确性。
			}
		},
		plugins: { vue: pluginVue, 'simple-import-sort': importSort }
	}
]