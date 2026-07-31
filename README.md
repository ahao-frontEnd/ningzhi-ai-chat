## packages.json

```js
// packages.json
"scripts": {
   "commit": "git-cz", // 这个命令使用了 git-cz 来代替 git commit，git-cz 是一个基于 commitizen 的工具，可以帮助开发者按照规范的格式编写提交信息，确保提交信息的一致性和可读性。
   // prepare 会在安装依赖时自动执行，确保 husky 的 git hooks 被正确安装,
   // prepare 是 husky 推荐的安装方式, 这样可以确保在任何环境中安装依赖时都能正确设置 git hooks
   "prepare": "husky"
},
"config": {
  "commitizen": {
    // 这是一个配置项，指定了 commitizen 使用的适配器路径。
    //  commitizen 是一个工具，用于帮助开发者编写符合规范的提交信息。
    // 通过指定 "path": "node_modules/cz-git"，我们告诉 commitizen 使用 cz-git 这个适配器来生成提交信息。
    // cz-git 是一个基于 Conventional Commits 规范的适配器，可以帮助开发者更方便地编写符合规范的提交信息，从而提高项目的可维护性和协作效率。
    "path": "node_modules/cz-git"
  }
},
// 配置 lint-staged 规则, 可以通过 pnpm lint-staged 来执行
// lint-staged 是一个工具，用于在提交代码之前对暂存区的文件进行检查和修复。
// 它允许你在提交代码之前运行一些命令来检查代码质量、格式化代码或者执行其他的任务，以确保提交的代码符合项目的规范和要求。
	"lint-staged": {
		"*.{md,json}": [
			"prettier --cache --write --no-error-on-unmatched-pattern"
		],
		"*.{css,less}": [
			"stylelint --fix",
			"prettier --cache --write"
		],
		"*.{js,jsx}": [
			"eslint --fix",
			"prettier --cache --write"
		],
		"*.{ts,tsx}": [
			"eslint --fix",
			"prettier --cache --parser=typescript --write"
		]
	},
```

## tsconfig.eslint.json

```js
// tsconfig.eslint.json
// 这个文件是为了 eslint 的 parserOptions.project 指向正确的 tsconfig 文件而创建的
{
  "extends": "./tsconfig.json", // 继承原来的 tsconfig.json 配置
  "compilerOptions": {
    "noEmit": true // 不生成任何输出文件
  },\
  // 指定要包含的文件路径，确保 eslint 能正确解析这些文件
  "include": [
    "packages/**/*",
    "apps/**/*"
  ]
}
```
