"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
(0, app_1.default)(app);
db_1.default;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
