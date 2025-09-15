import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;


// generating jwt token
export function generateToken(user) {
    return jwt.sign(
        {
            userId: user._id.toString(),
            orgId: user.organizationId.toString(),
            role: user.role?.name || user.role,
            name: user.name,
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
}

// verifying jwt token
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return null;
    }
}

// Checking auth and role(for API routes or middleware)
export function checkAuthAndRole(req, allowedRoles = []) {
    try {
        const token = req.cookies.get("token")?.value;   //read token from cookie

        if (!token) {
            return { error: "Unaithorized", status: 401 };
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
            return { error: "Forbidden", status: 403 }
        }
        return { user: decoded };   //success , and usr contains , userID, orgId, role
    } catch (err) {
        return { error: "Invalid token", status: 401 }
    }

}