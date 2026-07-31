// 这一行是为了让编辑器识别 stylelint 的配置文件类型，提供更好的代码提示和错误检查
/** @type {import('stylelint').Config} */

export default {
    extends: ['stylelint-config-standard'],
    overrides: [
        {
            files: ['*.scss', '**/*.scss'],
            extends: ['stylelint-config-standard-scss']
        },
        {
            files: ['*.vue', '**/*.vue'],
            extends: ['stylelint-config-standard-vue']
        }
    ]
}
