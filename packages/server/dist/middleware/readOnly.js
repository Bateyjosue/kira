"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readOnlyMiddleware = void 0;
const readOnlyMiddleware = (req, res, next) => {
    if (['PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        if (req.body && req.body.isSeeded) {
            return res.status(403).json({
                error: 'Forbidden: Seeded demo data is read-only and cannot be modified.',
            });
        }
    }
    next();
};
exports.readOnlyMiddleware = readOnlyMiddleware;
