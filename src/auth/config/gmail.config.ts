import { registerAs } from "@nestjs/config";

export default registerAs('gmail', () => ({
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
}))