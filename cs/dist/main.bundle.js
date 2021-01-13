/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkcs"] = self["webpackChunkcs"] || []).push([["main"],{

/***/ "./src/a/index.js":
/*!************************!*\
  !*** ./src/a/index.js ***!
  \************************/
/***/ ((module) => {

eval("module.exports = {\n  a:1234\n};\n\n\n//# sourceURL=webpack://cs/./src/a/index.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const a = __webpack_require__(/*! ./a/index.js */ \"./src/a/index.js\");\n// require('./index.less');\ndocument.body.innerHTML = \"<div class=\\\"a\\\">\"+a.a+\"</div>\"\n\n\n//# sourceURL=webpack://cs/./src/index.js?");

/***/ })

},
0,[["./src/index.js","runtime~main"]]]);