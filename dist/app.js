"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const index_route_1 = __importDefault(require("./apis/index.route"));
const path_1 = __importDefault(require("path"));
// import { rateLimiterUsingThirdParty } from '../public';yyy
const node_cron_1 = __importDefault(require("node-cron"));
const cronFn = __importStar(require("./apis/app/controller/cronJobs/packageCronJob"));
exports.default = (app) => {
    app.use('/', express_1.default.static(path_1.default.join(__dirname, '../public')));
    app.use('/', express_1.default.static(path_1.default.join(__dirname, '../uploads/signatures')));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
    app.use((0, cors_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, helmet_1.default)());
    // app.use(morgan('dev'));
    app.use((0, morgan_1.default)('common', {
        stream: fs_1.default.createWriteStream(__dirname + '/access.log', { flags: 'a' })
    }));
    // app.use('/api', rateLimiterUsingThirdParty, apiRouter);
    app.use('/api', index_route_1.default);
    app.get('/', (req, res) => {
        res.status(200).json('OK');
    });
    app.use('*', (req, res) => {
        res.status(404).json({ message: 'Resource not available' });
    });
    node_cron_1.default.schedule("0 1 * * *", function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Running a cron job");
            yield cronFn.packageExpireCronJob();
            fs_1.default.appendFile("logs.txt", "running cron job every day (hh/mm/05)/n", function (err) {
                if (err)
                    throw err;
            });
        });
    }, {
        scheduled: true, //true/false
        timezone: "Asia/Kolkata"
    });
    app.use((err, req, res, next) => {
        if (err) {
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: err
            });
        }
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({
            status: false,
            data: null,
            error: "Unexpected Error Occurred. Please contact our support team."
        });
    });
};
