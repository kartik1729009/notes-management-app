"use strict";
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
exports.login = exports.createUser = void 0;
const models_1 = __importDefault(require("../models/models"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = req.body;
        const existingUser = yield models_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "user already exist please login",
            });
            return;
        }
        let hashedPassword;
        try {
            hashedPassword = yield bcrypt_1.default.hash(password, 10);
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: "some error occured while hashing the password",
            });
        }
        const userInfo = yield models_1.default.create({
            fullName,
            email,
            password: hashedPassword,
        });
        res.status(200).json({
            success: true,
            message: "user entry created successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "can't create user entry",
        });
        return;
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "please enter email as well as password",
            });
            return;
        }
        const user = yield models_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "user dont exist, please create user"
            });
            return;
        }
        const payload = {
            email: user.email,
            id: user._id,
        };
        if (yield bcrypt_1.default.compare(password, user.password)) {
            let token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
            const options = {
                expires: new Date(Date.now() + 2 * 60 * 60),
                httpOnly: true,
            };
            if (res.headersSent) {
                return;
            }
            res.cookie("token1", token, options);
            res.status(200).json({
                success: true,
                token,
                user,
                message: "Login successful",
            });
            return;
        }
        else {
            res.status(403).json({
                success: false,
                message: "password incorrect",
            });
        }
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "internal server error",
        });
        return;
    }
});
exports.login = login;
