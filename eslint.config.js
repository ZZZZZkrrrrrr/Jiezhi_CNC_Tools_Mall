import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
export default tseslint.config({ignores:['dist','reference','scripts']},js.configs.recommended,...tseslint.configs.recommended,{files:['**/*.{ts,tsx}'],languageOptions:{globals:{window:'readonly',document:'readonly',localStorage:'readonly',setTimeout:'readonly'}},plugins:{'react-hooks':reactHooks},rules:{...reactHooks.configs.recommended.rules,'@typescript-eslint/no-explicit-any':'off','@typescript-eslint/no-unused-expressions':'off'}});
