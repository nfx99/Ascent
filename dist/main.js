/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 157:
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ 540:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || (function () {\n    var ownKeys = function(o) {\n        ownKeys = Object.getOwnPropertyNames || function (o) {\n            var ar = [];\n            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;\n            return ar;\n        };\n        return ownKeys(o);\n    };\n    return function (mod) {\n        if (mod && mod.__esModule) return mod;\n        var result = {};\n        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== \"default\") __createBinding(result, mod, k[i]);\n        __setModuleDefault(result, mod);\n        return result;\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst electron_1 = __webpack_require__(/*! electron */ 157);\nconst path = __importStar(__webpack_require__(/*! path */ 928));\nlet mainWindow = null;\nfunction createWindow() {\n    console.log('Creating window...');\n    mainWindow = new electron_1.BrowserWindow({\n        width: 1200,\n        height: 800,\n        webPreferences: {\n            nodeIntegration: true,\n            contextIsolation: false\n        }\n    });\n    // In development, load from webpack dev server\n    if (true) {\n        console.log('Loading from development server...');\n        // Wait for the dev server to be ready\n        const loadURL = () => {\n            mainWindow?.loadURL('http://localhost:3001')\n                .catch(err => {\n                console.error('Failed to load from dev server:', err);\n                // Retry after a short delay\n                setTimeout(loadURL, 1000);\n            });\n        };\n        loadURL();\n        mainWindow.webContents.openDevTools();\n    }\n    else {}\n    mainWindow.on('closed', () => {\n        mainWindow = null;\n    });\n    // Add error handling\n    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {\n        console.error('Failed to load:', errorCode, errorDescription);\n        if (true) {\n            console.log('Retrying to load from development server...');\n            setTimeout(() => {\n                mainWindow?.loadURL('http://localhost:3001');\n            }, 1000);\n        }\n    });\n}\nelectron_1.app.whenReady().then(() => {\n    console.log('App is ready');\n    createWindow();\n    electron_1.app.on('activate', () => {\n        if (electron_1.BrowserWindow.getAllWindows().length === 0) {\n            createWindow();\n        }\n    });\n});\nelectron_1.app.on('window-all-closed', () => {\n    if (process.platform !== 'darwin') {\n        electron_1.app.quit();\n    }\n});\n// Handle the 'before-quit' event\nelectron_1.app.on('before-quit', () => {\n    // This will ensure the app quits completely\n    electron_1.app.exit(0);\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNTQwLmpzIiwibWFwcGluZ3MiOiJBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLG9DQUFvQztBQUNuRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwwQ0FBMEMsNEJBQTRCO0FBQ3RFLENBQUM7QUFDRDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQsY0FBYztBQUN6RTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELG1CQUFtQixtQkFBTyxDQUFDLG1CQUFVO0FBQ3JDLDBCQUEwQixtQkFBTyxDQUFDLGVBQU07QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxRQUFRLElBQXNDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEVBS0o7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBc0M7QUFDbEQ7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2FzY2VudC8uL3NyYy9tYWluLnRzP2VmZjgiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG93bktleXMgPSBmdW5jdGlvbihvKSB7XG4gICAgICAgIG93bktleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgdmFyIGFyID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBrIGluIG8pIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgaykpIGFyW2FyLmxlbmd0aF0gPSBrO1xuICAgICAgICAgICAgcmV0dXJuIGFyO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb3duS2V5cyhvKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAobW9kKSB7XG4gICAgICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrID0gb3duS2V5cyhtb2QpLCBpID0gMDsgaSA8IGsubGVuZ3RoOyBpKyspIGlmIChrW2ldICE9PSBcImRlZmF1bHRcIikgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrW2ldKTtcbiAgICAgICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGVsZWN0cm9uXzEgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7XG5jb25zdCBwYXRoID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCJwYXRoXCIpKTtcbmxldCBtYWluV2luZG93ID0gbnVsbDtcbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpIHtcbiAgICBjb25zb2xlLmxvZygnQ3JlYXRpbmcgd2luZG93Li4uJyk7XG4gICAgbWFpbldpbmRvdyA9IG5ldyBlbGVjdHJvbl8xLkJyb3dzZXJXaW5kb3coe1xuICAgICAgICB3aWR0aDogMTIwMCxcbiAgICAgICAgaGVpZ2h0OiA4MDAsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAgICAgICBjb250ZXh0SXNvbGF0aW9uOiBmYWxzZVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gSW4gZGV2ZWxvcG1lbnQsIGxvYWQgZnJvbSB3ZWJwYWNrIGRldiBzZXJ2ZXJcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgZnJvbSBkZXZlbG9wbWVudCBzZXJ2ZXIuLi4nKTtcbiAgICAgICAgLy8gV2FpdCBmb3IgdGhlIGRldiBzZXJ2ZXIgdG8gYmUgcmVhZHlcbiAgICAgICAgY29uc3QgbG9hZFVSTCA9ICgpID0+IHtcbiAgICAgICAgICAgIG1haW5XaW5kb3c/LmxvYWRVUkwoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMScpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgZnJvbSBkZXYgc2VydmVyOicsIGVycik7XG4gICAgICAgICAgICAgICAgLy8gUmV0cnkgYWZ0ZXIgYSBzaG9ydCBkZWxheVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQobG9hZFVSTCwgMTAwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgbG9hZFVSTCgpO1xuICAgICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgZnJvbSBmaWxlLi4uJyk7XG4gICAgICAgIGNvbnN0IGluZGV4UGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdyZW5kZXJlci9pbmRleC5odG1sJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIGluZGV4IGZyb206JywgaW5kZXhQYXRoKTtcbiAgICAgICAgbWFpbldpbmRvdy5sb2FkRmlsZShpbmRleFBhdGgpO1xuICAgIH1cbiAgICBtYWluV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgICAgIG1haW5XaW5kb3cgPSBudWxsO1xuICAgIH0pO1xuICAgIC8vIEFkZCBlcnJvciBoYW5kbGluZ1xuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub24oJ2RpZC1mYWlsLWxvYWQnLCAoZXZlbnQsIGVycm9yQ29kZSwgZXJyb3JEZXNjcmlwdGlvbikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbG9hZDonLCBlcnJvckNvZGUsIGVycm9yRGVzY3JpcHRpb24pO1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXRyeWluZyB0byBsb2FkIGZyb20gZGV2ZWxvcG1lbnQgc2VydmVyLi4uJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBtYWluV2luZG93Py5sb2FkVVJMKCdodHRwOi8vbG9jYWxob3N0OjMwMDEnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5lbGVjdHJvbl8xLmFwcC53aGVuUmVhZHkoKS50aGVuKCgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnQXBwIGlzIHJlYWR5Jyk7XG4gICAgY3JlYXRlV2luZG93KCk7XG4gICAgZWxlY3Ryb25fMS5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xuICAgICAgICBpZiAoZWxlY3Ryb25fMS5Ccm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNyZWF0ZVdpbmRvdygpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcbmVsZWN0cm9uXzEuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcbiAgICAgICAgZWxlY3Ryb25fMS5hcHAucXVpdCgpO1xuICAgIH1cbn0pO1xuLy8gSGFuZGxlIHRoZSAnYmVmb3JlLXF1aXQnIGV2ZW50XG5lbGVjdHJvbl8xLmFwcC5vbignYmVmb3JlLXF1aXQnLCAoKSA9PiB7XG4gICAgLy8gVGhpcyB3aWxsIGVuc3VyZSB0aGUgYXBwIHF1aXRzIGNvbXBsZXRlbHlcbiAgICBlbGVjdHJvbl8xLmFwcC5leGl0KDApO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///540\n");

/***/ }),

/***/ 928:
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(540);
/******/ 	
/******/ })()
;