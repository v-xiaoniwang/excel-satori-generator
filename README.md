# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# 笔记
如果需要添加新的 answertype 或者 problemType,在config下的dastMenuData.json中进行修改更新

"{AnswerType}": [
    { "key": "小写", "label": "{ProblemType}", "children": [{ "key": "小写", "label": "{devOwner}" }] },
  ],
例子：
"Knowledge Task Pane": [
    { "key": "actions", "label": "Actions", "children": [{ "key": "neelam", "label": "Neelam Singh" }] },
	{ "key": "entityImage", "label": "Entity Image", "children": [{ "key": "neelam", "label": "Neelam Singh" }] }
  ],
----------------------------------------------------------------------------------------------------------------------------------

如果需要添加新的 Comments 模板 就在config 下的 dastTemplates.json中进行 修改
"AnswerType>ProblemType":"添加你需要的内容",
例子：
"Knowledge Task Pane>Triggering":"Issue: Incorrect triggering of KC.\nRoot Cause: \nAction Taken: I have editorially blocked the query \"\" in Block List in Triggers in ERB. Made changes are reflecting fine. Please find the attached screenshot.\nSID: \nThe original screenshot for the issue:\nThe screenshot after the issue mitigated:\n"

注意事项：如果文本里面用到 "" 双引号的 需要转移 \"\",需要换行 \n
-----------------------------------------------------------------------------------------------------------------------------------

如果需要在那个 problemType下添加一些注意事项 ,就在 dastWarnings.json 中添加

"AnswerType>ProblemType>Devowner": [
    "需要注意的事项"
  ],
例子：
  "Knowledge Task Pane>Places of interest>Jithendar Paladugula <jpalad@microsoft.com>": [
    "1.Powered by Travel team, Jithendar will help to coordinate."
  ],

注意：AnswerType>ProblemType>Devowner 的内容 参考dastMenuData.json中的 写法,需要一致
--------------------------------------------------------------------------------------------------------------------------------------

如果需要对注意事项的关键词或者句子进行高亮,就在 highlightRules.json 中修改或者添加
  {
    "word": "",
    "color": "",
    "background": ""
  },
例子：
  {
    "word": "Yining Chen <Yining.Chen@microsoft.com>",
    "color": "#237804",
    "background": "#f6ffed"
  },
注意：word的内容 对应的是 dastWarnings.json 注意事项的数据中的内容,color 是字体颜色,background是背景颜色,颜色可以在chtgpt上查
